'use server'

import { stripe } from '@/lib/stripe'

export async function handleDonationSuccess(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId)
  const { type, donorName, frequency } = session.metadata ?? {}
  if (type !== 'donation') return null

  const email = session.customer_details?.email ?? ''
  const name = donorName ?? session.customer_details?.name ?? 'Friend'
  const amount = Math.round((session.amount_total ?? 0) / 100)

  try {
    const { prisma } = await import('@/lib/prisma')

    const existing = await prisma.donor.findUnique({ where: { stripeSessionId: sessionId } })
    if (existing) return { name, email, amount, frequency: frequency ?? 'one-time' }

    await prisma.donor.create({
      data: {
        name,
        email,
        amount,
        frequency: frequency ?? 'one-time',
        stripeCustomerId: session.customer as string | undefined,
        stripeSessionId: sessionId,
      },
    })

    if (email) {
      const { sendDonationThankYou } = await import('@/lib/email')
      await sendDonationThankYou({ to: email, name, amount, frequency: frequency ?? 'one-time' })
    }
  } catch (err) {
    console.error('handleDonationSuccess error:', err)
  }

  return { name, email, amount, frequency: frequency ?? 'one-time' }
}

export async function handleAdoptionSuccess(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId)
  const { type, animalSlug, animalName, tierLabel, donorName, interval } = session.metadata ?? {}
  if (type !== 'adoption') return null

  const email = session.customer_details?.email ?? ''
  const name = donorName ?? session.customer_details?.name ?? 'Friend'
  const amount = Math.round((session.amount_total ?? 0) / 100)

  try {
    const { prisma } = await import('@/lib/prisma')

    const existing = await prisma.adoption.findUnique({ where: { stripeSessionId: sessionId } })
    if (existing) return { name, email, amount, animalName: animalName ?? animalSlug ?? '', tierLabel: tierLabel ?? '', interval: interval ?? 'month' }

    await prisma.adoption.create({
      data: {
        donorName: name,
        donorEmail: email,
        animalSlug: animalSlug ?? '',
        animalName: animalName ?? animalSlug ?? '',
        tierLabel: tierLabel ?? '',
        amount,
        interval: interval ?? 'month',
        stripeCustomerId: session.customer as string | undefined,
        stripeSessionId: sessionId,
      },
    })

    if (email) {
      const { sendAdoptionConfirmation } = await import('@/lib/email')
      await sendAdoptionConfirmation({
        to: email,
        name,
        animalName: animalName ?? animalSlug ?? 'animal',
        tierLabel: tierLabel ?? '',
        amount,
        interval: interval ?? 'month',
      })
    }
  } catch (err) {
    console.error('handleAdoptionSuccess error:', err)
  }

  return { name, email, amount, animalName: animalName ?? animalSlug ?? '', tierLabel: tierLabel ?? '', interval: interval ?? 'month' }
}

export async function handleShopSuccess(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items'],
  })
  const { type } = session.metadata ?? {}
  if (type !== 'shop') return null

  const email = session.customer_details?.email ?? ''
  const name = session.customer_details?.name ?? 'Friend'
  const phone = session.customer_details?.phone ?? undefined
  const amount = Math.round((session.amount_total ?? 0) / 100)

  const shipping = (session as unknown as { shipping_details?: { name?: string; address?: { line1?: string; line2?: string; city?: string; state?: string; postal_code?: string; country?: string } } }).shipping_details
  const shippingAddress = shipping
    ? {
        name: shipping.name,
        line1: shipping.address?.line1,
        line2: shipping.address?.line2,
        city: shipping.address?.city,
        state: shipping.address?.state,
        postalCode: shipping.address?.postal_code,
        country: shipping.address?.country,
      }
    : null

  const lineItemsData = session.line_items?.data ?? []
  const items = lineItemsData.map((li) => ({
    name: li.description ?? '',
    quantity: li.quantity ?? 1,
    price: Math.round((li.amount_total ?? 0) / 100 / (li.quantity ?? 1)),
  }))

  try {
    const { prisma } = await import('@/lib/prisma')

    const existing = await prisma.order.findUnique({ where: { stripeSessionId: sessionId } })
    if (existing) return { name, email, amount, items, shippingAddress }

    await prisma.order.create({
      data: {
        customerEmail: email,
        customerName: name,
        phone: phone ?? null,
        shippingAddress: shippingAddress ?? undefined,
        items,
        total: amount,
        stripeSessionId: sessionId,
      },
    })

    if (email) {
      const { sendOrderConfirmation } = await import('@/lib/email')
      await sendOrderConfirmation({ to: email, name, items, total: amount })
    }
  } catch (err) {
    console.error('handleShopSuccess error:', err)
  }

  return { name, email, amount, items, shippingAddress }
}
