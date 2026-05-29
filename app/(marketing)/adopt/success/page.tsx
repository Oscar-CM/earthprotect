export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { Award, Heart, PawPrint } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { handleAdoptionSuccess } from '@/app/actions/checkout'
import { ANIMALS } from '@/lib/constants'

export const metadata = { title: 'Adoption Confirmed — Welcome!' }

export default async function AdoptSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ animal?: string; session_id?: string }>
}) {
  const { animal: slug, session_id } = await searchParams
  const staticAnimal = slug ? ANIMALS.find((a) => a.slug === slug) : null
  const data = session_id ? await handleAdoptionSuccess(session_id) : null

  const animalName = data?.animalName ?? staticAnimal?.name ?? 'your animal'

  return (
    <div className="min-h-screen pt-24 flex items-center justify-center px-6" style={{ background: 'var(--ep-bg)' }}>
      <div className="text-center max-w-lg">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: 'color-mix(in srgb, var(--ep-primary) 15%, transparent)' }}
        >
          <Award size={36} style={{ color: 'var(--ep-primary)' }} />
        </div>

        <h1
          className="text-3xl font-bold mb-2"
          style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}
        >
          {data?.name ? `Welcome, ${data.name.split(' ')[0]}!` : 'Adoption Confirmed!'}
        </h1>
        <p className="text-base font-semibold mb-4" style={{ color: 'var(--ep-primary)' }}>
          You&apos;ve adopted a {animalName}! 🐾
        </p>

        {data && (
          <div
            className="my-5 p-5 rounded-xl text-left space-y-2"
            style={{ background: 'var(--ep-card)', border: '1px solid var(--ep-border)' }}
          >
            <p className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--ep-text)' }}>
              <PawPrint size={15} style={{ color: 'var(--ep-primary)' }} /> Adoption Summary
            </p>
            <div className="flex justify-between text-sm">
              <span style={{ color: 'var(--ep-muted)' }}>Animal</span>
              <span className="font-medium" style={{ color: 'var(--ep-text)' }}>{data.animalName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: 'var(--ep-muted)' }}>Plan</span>
              <span className="font-medium" style={{ color: 'var(--ep-text)' }}>{data.tierLabel}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: 'var(--ep-muted)' }}>Amount</span>
              <span className="font-bold" style={{ color: 'var(--ep-primary)' }}>
                ${data.amount}/{data.interval}
              </span>
            </div>
            {data.email && (
              <div className="flex justify-between text-sm">
                <span style={{ color: 'var(--ep-muted)' }}>Certificate sent to</span>
                <span className="font-medium" style={{ color: 'var(--ep-text)' }}>{data.email}</span>
              </div>
            )}
          </div>
        )}

        <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--ep-muted)' }}>
          Your digital adoption certificate and welcome pack have been sent to your email.
          Thank you for making a real difference for Africa&apos;s wildlife.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/animals">
            <Button variant="outline" style={{ borderColor: 'var(--ep-border)', color: 'var(--ep-text)' }}>
              Explore More Animals
            </Button>
          </Link>
          <Link href="/donate">
            <Button className="gap-2 text-white" style={{ background: 'var(--ep-secondary)', border: 'none' }}>
              <Heart size={16} /> Also Donate
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
