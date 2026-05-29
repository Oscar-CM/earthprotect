'use server'

import { redirect } from 'next/navigation'
import { stripe } from '@/lib/stripe'
import type { CartItem } from '@/types'

// Card + Link (Stripe one-click) for all checkout types
const PAYMENT_METHODS = ['card', 'link'] as const

export async function createDonationCheckout(
  amount: number,
  frequency: 'one-time' | 'monthly' | 'annual',
  donorEmail: string,
  donorName: string
) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

  if (frequency === 'one-time') {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: [...PAYMENT_METHODS],
      customer_email: donorEmail,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Earth Protect Donation — ${donorName}`,
              description: 'One-time donation to African wildlife conservation.',
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/donate`,
      metadata: { type: 'donation', frequency: 'one-time', donorName },
    })
    redirect(session.url!)
  } else {
    const interval = frequency === 'monthly' ? 'month' : 'year'
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: [...PAYMENT_METHODS],
      customer_email: donorEmail,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Earth Protect ${frequency === 'monthly' ? 'Monthly' : 'Annual'} Donation`,
              description: `Recurring ${frequency} donation to African wildlife conservation.`,
            },
            unit_amount: Math.round(amount * 100),
            recurring: { interval },
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/donate`,
      metadata: { type: 'donation', frequency, donorName },
    })
    redirect(session.url!)
  }
}

export async function createAdoptionSubscription(
  animalSlug: string,
  animalName: string,
  tierLabel: string,
  amount: number,
  interval: 'month' | 'year',
  donorEmail: string,
  donorName: string
) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: [...PAYMENT_METHODS],
    customer_email: donorEmail,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Adopt a ${animalName} — ${tierLabel}`,
            description: `Monthly sponsorship supporting ${animalName} conservation in Africa.`,
          },
          unit_amount: Math.round(amount * 100),
          recurring: { interval },
        },
        quantity: 1,
      },
    ],
    success_url: `${baseUrl}/adopt/success?animal=${animalSlug}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/adopt?animal=${animalSlug}`,
    metadata: { type: 'adoption', animalSlug, animalName, tierLabel, donorName, interval },
  })
  redirect(session.url!)
}

export async function createShopCheckout(cartItems: CartItem[], customerEmail?: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

  const lineItems = cartItems.map((ci) => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: ci.item.name,
        description: ci.item.proceedsNote,
        images: [ci.item.imageUrl],
      },
      unit_amount: Math.round(ci.item.price * 100),
    },
    quantity: ci.quantity,
  }))

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: [...PAYMENT_METHODS],
    ...(customerEmail ? { customer_email: customerEmail } : {}),
    line_items: lineItems,
    shipping_address_collection: {
      allowed_countries: [
        'US', 'GB', 'CA', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL', 'SE',
        'NO', 'DK', 'FI', 'ZA', 'NG', 'KE', 'GH', 'TZ', 'UG', 'RW',
        'IN', 'SG', 'AE', 'JP', 'NZ',
      ],
    },
    phone_number_collection: { enabled: true },
    billing_address_collection: 'required',
    success_url: `${baseUrl}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/shop`,
    metadata: { type: 'shop' },
  })
  redirect(session.url!)
}
