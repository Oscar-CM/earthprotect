export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { Check, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { handleDonationSuccess } from '@/app/actions/checkout'

export const metadata = { title: 'Thank You — Donation Confirmed' }

export default async function DonateSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams
  const data = session_id ? await handleDonationSuccess(session_id) : null

  return (
    <div className="min-h-screen pt-24 flex items-center justify-center px-6" style={{ background: 'var(--ep-bg)' }}>
      <div className="text-center max-w-lg">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: 'color-mix(in srgb, var(--ep-secondary) 15%, transparent)' }}
        >
          <Check size={36} style={{ color: 'var(--ep-secondary)' }} />
        </div>

        <h1
          className="text-3xl font-bold mb-3"
          style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}
        >
          {data?.name ? `Thank you, ${data.name.split(' ')[0]}!` : 'Thank You!'}
        </h1>

        {data && (
          <div
            className="my-5 p-5 rounded-xl text-left space-y-2"
            style={{ background: 'var(--ep-card)', border: '1px solid var(--ep-border)' }}
          >
            <p className="text-sm font-semibold mb-3" style={{ color: 'var(--ep-text)' }}>Donation Summary</p>
            <div className="flex justify-between text-sm">
              <span style={{ color: 'var(--ep-muted)' }}>Amount</span>
              <span className="font-bold" style={{ color: 'var(--ep-primary)' }}>${data.amount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: 'var(--ep-muted)' }}>Frequency</span>
              <span className="font-medium capitalize" style={{ color: 'var(--ep-text)' }}>{data.frequency}</span>
            </div>
            {data.email && (
              <div className="flex justify-between text-sm">
                <span style={{ color: 'var(--ep-muted)' }}>Confirmation sent to</span>
                <span className="font-medium" style={{ color: 'var(--ep-text)' }}>{data.email}</span>
              </div>
            )}
          </div>
        )}

        <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--ep-muted)' }}>
          Your donation has been received and a confirmation email is on its way.
          Your generosity directly protects Africa&apos;s most vulnerable wildlife and habitats.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/animals">
            <Button variant="outline" style={{ borderColor: 'var(--ep-border)', color: 'var(--ep-text)' }}>
              Meet the Animals
            </Button>
          </Link>
          <Link href="/adopt">
            <Button className="gap-2 text-white" style={{ background: 'var(--ep-primary)', border: 'none' }}>
              <Heart size={16} /> Adopt an Animal
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
