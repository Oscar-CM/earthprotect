'use client'

import { useState, useTransition } from 'react'
import { Heart, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DonationTierCard } from '@/components/cards/DonationTierCard'
import { useDonationStore } from '@/store/donationStore'
import { createDonationCheckout } from '@/app/actions/stripe'
import { DONATION_TIERS } from '@/lib/constants'
import type { DonationTier, DonationFrequency } from '@/types'

const QUICK_AMOUNTS = [10, 25, 50, 100]

export function DonationForm() {
  const {
    selectedTier,
    customAmount,
    frequency,
    donorName,
    donorEmail,
    setTier,
    setCustomAmount,
    setFrequency,
    setDonorInfo,
    effectiveAmount,
  } = useDonationStore()

  const [name, setName] = useState(donorName)
  const [email, setEmail] = useState(donorEmail)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  const tiers = DONATION_TIERS.map((t) => ({
    ...t,
    frequency: frequency as DonationFrequency,
  }))

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const amount = effectiveAmount()
    if (!amount || amount < 1) {
      setError('Please select a donation amount.')
      return
    }
    if (!name.trim() || !email.trim()) {
      setError('Please fill in your name and email.')
      return
    }

    setDonorInfo(name, email)
    startTransition(() => {
      createDonationCheckout(amount, frequency, email, name).catch((err) => {
        if (err?.digest?.startsWith('NEXT_REDIRECT')) return
        setError('Something went wrong. Please try again.')
      })
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Frequency toggle */}
      <div>
        <p className="text-sm font-semibold mb-3" style={{ color: 'var(--ep-text)' }}>
          Donation Frequency
        </p>
        <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: 'var(--ep-border)' }}>
          {(['monthly', 'annual', 'one-time'] as DonationFrequency[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFrequency(f)}
              className="flex-1 py-2 text-sm font-medium capitalize transition-colors"
              style={{
                background: frequency === f ? 'var(--ep-primary)' : 'var(--ep-card)',
                color: frequency === f ? 'white' : 'var(--ep-muted)',
                border: 'none',
              }}
            >
              {f === 'one-time' ? 'One-Time' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tiers */}
      <div>
        <p className="text-sm font-semibold mb-3" style={{ color: 'var(--ep-text)' }}>
          Choose an Amount
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tiers.map((tier) => (
            <DonationTierCard
              key={tier.id}
              tier={tier}
              selected={selectedTier?.id === tier.id}
              onSelect={(t: DonationTier) => setTier(t)}
            />
          ))}
        </div>
      </div>

      {/* Custom amount */}
      <div>
        <p className="text-sm font-semibold mb-2" style={{ color: 'var(--ep-text)' }}>
          Or enter a custom amount
        </p>
        <div className="flex gap-2 flex-wrap">
          {QUICK_AMOUNTS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setCustomAmount(a)}
              className="px-4 py-2 rounded-lg text-sm font-medium border transition-all"
              style={{
                background: customAmount === a ? 'var(--ep-primary)' : 'var(--ep-card)',
                color: customAmount === a ? 'white' : 'var(--ep-text)',
                borderColor: customAmount === a ? 'var(--ep-primary)' : 'var(--ep-border)',
              }}
            >
              ${a}
            </button>
          ))}
          <div className="relative">
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2 text-sm"
              style={{ color: 'var(--ep-muted)' }}
            >
              $
            </span>
            <Input
              type="number"
              min={1}
              placeholder="Other"
              value={customAmount && !QUICK_AMOUNTS.includes(customAmount) ? customAmount : ''}
              onChange={(e) => setCustomAmount(e.target.value ? Number(e.target.value) : null)}
              className="pl-6 w-28 text-sm"
              style={{ borderColor: 'var(--ep-border)' }}
            />
          </div>
        </div>
      </div>

      {/* Donor info */}
      <div className="space-y-3">
        <p className="text-sm font-semibold" style={{ color: 'var(--ep-text)' }}>
          Your Details
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          <Input
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ borderColor: 'var(--ep-border)' }}
          />
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ borderColor: 'var(--ep-border)' }}
          />
        </div>
      </div>

      {error && (
        <p className="text-sm" style={{ color: 'var(--ep-critical)' }}>{error}</p>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className="w-full text-white font-semibold gap-2 py-6 text-base"
        style={{ background: 'var(--ep-primary)', border: 'none' }}
      >
        {isPending ? (
          <><Loader2 size={18} className="animate-spin" /> Processing…</>
        ) : (
          <><Heart size={18} /> Donate {effectiveAmount() ? `$${effectiveAmount()}` : 'Now'}</>
        )}
      </Button>

      <p className="text-xs text-center" style={{ color: 'var(--ep-muted)' }}>
        Secure checkout powered by Stripe. Your donation directly funds African wildlife conservation.
      </p>
    </form>
  )
}
