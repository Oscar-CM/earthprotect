'use server'

export async function submitJoinApplication(data: {
  firstName: string
  lastName: string
  email: string
  country: string
  role: string
  motivation: string
  newsletter: boolean
}) {
  try {
    const { prisma } = await import('@/lib/prisma')
    await prisma.joinApplication.create({
      data: {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim().toLowerCase(),
        country: data.country.trim(),
        role: data.role,
        motivation: data.motivation.trim() || null,
        newsletter: data.newsletter,
        status: 'pending',
      },
    })

    // Send welcome email
    try {
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)
      const FROM = process.env.EMAIL_FROM ?? 'Earth Protect <onboarding@resend.dev>'
      const roleLabels: Record<string, string> = {
        community: 'Community Member',
        volunteer: 'Field Volunteer',
        ambassador: 'Brand Ambassador',
      }
      const label = roleLabels[data.role] ?? data.role
      const isApplication = data.role !== 'community'

      await resend.emails.send({
        from: FROM,
        to: data.email,
        subject: isApplication
          ? `Application received — ${label} · Earth Protect`
          : `Welcome to Earth Protect, ${data.firstName}! 🌍`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
            <div style="background:#1a5c3a;padding:32px 24px;border-radius:12px 12px 0 0;text-align:center">
              <h1 style="color:#fff;margin:0;font-size:24px">Earth Protect</h1>
              <p style="color:rgba(255,255,255,0.8);margin:8px 0 0">Protecting Africa's Wildlife</p>
            </div>
            <div style="background:#fff;padding:32px 24px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb">
              <h2 style="color:#1a5c3a;margin-top:0">
                ${isApplication ? `Application received, ${data.firstName}!` : `Welcome, ${data.firstName}!`}
              </h2>
              <p>
                ${isApplication
                  ? `Thank you for applying to join Earth Protect as a <strong>${label}</strong>. We've received your application and will review it within 3–5 business days.`
                  : `You're now part of the Earth Protect community as a <strong>${label}</strong>. Welcome to a global movement protecting Africa's most vulnerable wildlife.`}
              </p>
              ${isApplication ? `
              <div style="background:#f0fdf4;border-left:4px solid #1a5c3a;padding:16px;border-radius:4px;margin:24px 0">
                <p style="margin:0;color:#166534;font-weight:bold">What happens next?</p>
                <p style="margin:8px 0 0;color:#374151;font-size:14px">Our team will review your application and reach out to the email address you provided. In the meantime, follow us on social media for the latest conservation updates.</p>
              </div>` : ''}
              <a href="${process.env.NEXT_PUBLIC_BASE_URL}" style="display:inline-block;background:#1a5c3a;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:bold;margin-top:8px">
                Explore Earth Protect
              </a>
              <p style="color:#6b7280;font-size:14px;margin-top:32px;border-top:1px solid #e5e7eb;padding-top:16px">
                Earth Protect · Conservation for Africa's Wildlife
              </p>
            </div>
          </div>`,
      })
    } catch (emailErr) {
      console.error('[Join] Email send failed:', emailErr)
    }

    return { success: true }
  } catch (err) {
    console.error('[Join] DB save failed:', err)
    return { success: false, error: 'Failed to submit application. Please try again.' }
  }
}

export async function updateApplicationStatus(id: string, status: string, notes?: string) {
  const { prisma } = await import('@/lib/prisma')
  await prisma.joinApplication.update({
    where: { id },
    data: { status, notes: notes ?? undefined },
  })
}
