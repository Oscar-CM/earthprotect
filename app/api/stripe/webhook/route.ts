import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import type Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: `Webhook signature verification failed: ${message}` }, { status: 400 })
  }

  try {
    const { prisma } = await import('@/lib/prisma')

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const { type, animalSlug, animalName, tierLabel, donorName, frequency, interval } =
          session.metadata ?? {}
        const email = session.customer_details?.email ?? ''
        const name = donorName ?? session.customer_details?.name ?? 'Friend'
        const amountCents = session.amount_total ?? 0

        if (type === 'adoption') {
          await prisma.adoption.create({
            data: {
              donorName: name,
              donorEmail: email,
              animalSlug: animalSlug ?? '',
              animalName: animalName ?? animalSlug ?? '',
              tierLabel: tierLabel ?? '',
              amount: Math.round(amountCents / 100),
              interval: interval ?? 'month',
              stripeCustomerId: session.customer as string | undefined,
              stripeSessionId: session.id,
            },
          })
          if (email) {
            const { sendAdoptionConfirmation } = await import('@/lib/email')
            await sendAdoptionConfirmation({
              to: email,
              name,
              animalName: animalName ?? animalSlug ?? 'animal',
              tierLabel: tierLabel ?? '',
              amount: Math.round(amountCents / 100),
              interval: interval ?? 'month',
            })
          }
        } else if (type === 'donation') {
          await prisma.donor.create({
            data: {
              name,
              email,
              amount: Math.round(amountCents / 100),
              frequency: frequency ?? 'one-time',
              stripeCustomerId: session.customer as string | undefined,
              stripeSessionId: session.id,
            },
          })
          if (email) {
            const { sendDonationThankYou } = await import('@/lib/email')
            await sendDonationThankYou({
              to: email,
              name,
              amount: Math.round(amountCents / 100),
              frequency: frequency ?? 'one-time',
            })
          }
        } else if (type === 'shop') {
          const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 50 })
          const items = lineItems.data.map((li) => ({
            name: li.description ?? '',
            quantity: li.quantity ?? 1,
            price: (li.amount_total ?? 0) / 100 / (li.quantity ?? 1),
          }))
          await prisma.order.create({
            data: {
              customerEmail: email,
              customerName: name,
              items,
              total: Math.round(amountCents / 100),
              stripeSessionId: session.id,
            },
          })
          if (email) {
            const { sendOrderConfirmation } = await import('@/lib/email')
            await sendOrderConfirmation({ to: email, name, items, total: amountCents / 100 })
          }
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await prisma.adoption.updateMany({
          where: { stripeCustomerId: subscription.customer as string },
          data: { active: false },
        })
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerEmail =
          typeof invoice.customer_email === 'string' ? invoice.customer_email : null
        if (customerEmail) {
          const donor = await prisma.donor.findFirst({ where: { email: customerEmail } })
          const adopter = await prisma.adoption.findFirst({ where: { donorEmail: customerEmail } })
          const name = donor?.name ?? adopter?.donorName ?? 'Friend'
          const { sendPaymentFailedNotice } = await import('@/lib/email')
          await sendPaymentFailedNotice({ to: customerEmail, name })
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        console.log(`Recurring payment received: ${invoice.id}`)
        break
      }
    }
  } catch (err) {
    console.error('Webhook handler error:', err)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
