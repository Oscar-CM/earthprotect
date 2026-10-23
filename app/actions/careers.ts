'use server'

import { openingAvailability } from '@/lib/careers'

export async function submitJobApplication(data: {
  firstName: string
  lastName: string
  email: string
  phone: string
  openingId: string
  residence: string
  yearsExperience: string
  rightToWork: boolean
  backgroundConsent: boolean
  motivation: string
}) {
  if (!data.rightToWork || !data.backgroundConsent) {
    return { success: false, error: 'Please confirm both declarations to apply.' }
  }
  if (!data.firstName.trim() || !data.lastName.trim() || !/^\S+@\S+\.\S+$/.test(data.email.trim())) {
    return { success: false, error: 'Please enter your name and a valid email address.' }
  }
  if (data.motivation.length > 5000 || data.firstName.length > 100 || data.lastName.length > 100) {
    return { success: false, error: 'Some of your answers are too long.' }
  }
  const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)

  try {
    const { prisma } = await import('@/lib/prisma')
    const opening = await prisma.careerOpening.findUnique({
      where: { id: data.openingId },
      include: { country: true, role: true },
    })
    if (!opening || !opening.country.published || !opening.role.published) {
      return { success: false, error: 'This position is no longer available.' }
    }
    const availability = openingAvailability(opening.status, opening.opensAt, opening.closesAt)
    if (availability !== 'open') {
      return { success: false, error: 'This position is not currently accepting applications.' }
    }

    const country = opening.country
    const role = { title: opening.role.title }
    const email = data.email.trim().toLowerCase()

    const existing = await prisma.joinApplication.findFirst({
      where: { openingId: opening.id, email },
      select: { id: true },
    })
    if (existing) {
      return { success: false, error: 'You have already applied for this position.' }
    }

    await prisma.joinApplication.create({
      data: {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email,
        country: country.name,
        role: `job:${country.code}:${opening.role.slug}`,
        motivation: data.motivation.trim(),
        newsletter: false,
        status: 'pending',
        stage: 'applied',
        openingId: opening.id,
        phone: data.phone.trim(),
        residence: data.residence.trim(),
        yearsExperience: data.yearsExperience.trim(),
        rightToWork: data.rightToWork,
        backgroundConsent: data.backgroundConsent,
        events: { create: { type: 'applied', toStage: 'applied', note: 'Application submitted online' } },
      },
    })

    try {
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)
      const FROM = process.env.EMAIL_FROM ?? 'Earth Protect <onboarding@resend.dev>'
      await resend.emails.send({
        from: FROM,
        to: email,
        subject: `Application received: ${role.title}, ${country.name} · Earth Protect`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
            <div style="background:#1a5c3a;padding:32px 24px;border-radius:12px 12px 0 0;text-align:center">
              <h1 style="color:#fff;margin:0;font-size:24px">Earth Protect</h1>
            </div>
            <div style="background:#fff;padding:32px 24px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb">
              <h2 style="color:#1a5c3a;margin-top:0">Thank you, ${esc(data.firstName.trim())}</h2>
              <p>We have received your application for <strong>${role.title}</strong> in <strong>${country.name}</strong>.</p>
              <div style="background:#f0fdf4;border-left:4px solid #1a5c3a;padding:16px;border-radius:4px;margin:24px 0">
                <p style="margin:0;color:#166534;font-weight:bold">What happens next?</p>
                <p style="margin:8px 0 0;color:#374151;font-size:14px">We review applications as they arrive. Shortlisted candidates are interviewed, and before any offer we verify identity, right to work, criminal record and references as allowed by ${country.name}'s laws. You will only be asked for documents once you are shortlisted.</p>
              </div>
              <p style="color:#6b7280;font-size:14px;margin-top:32px;border-top:1px solid #e5e7eb;padding-top:16px">
                Earth Protect · Conservation for Africa's Wildlife
              </p>
            </div>
          </div>`,
      })
    } catch (emailErr) {
      console.error('[Careers] Email send failed:', emailErr)
    }

    return { success: true }
  } catch (err) {
    console.error('[Careers] DB save failed:', err)
    return { success: false, error: 'Failed to submit application. Please try again.' }
  }
}
