'use client'

import { Check } from 'lucide-react'
import type { DonationTier } from '@/types'

interface DonationTierCardProps {
  tier: DonationTier
  selected: boolean
  onSelect: (tier: DonationTier) => void
}

export function DonationTierCard({ tier, selected, onSelect }: DonationTierCardProps) {
  return (
    <button
      onClick={() => onSelect(tier)}
      className="w-full text-left rounded-xl p-5 transition-all duration-200 focus:outline-none"
      style={{
        background: selected
          ? 'color-mix(in srgb, var(--ep-primary) 8%, var(--ep-card))'
          : 'var(--ep-card)',
        border: `2px solid ${selected ? 'var(--ep-primary)' : tier.featured ? 'color-mix(in srgb, var(--ep-primary) 40%, transparent)' : 'var(--ep-border)'}`,
        boxShadow: selected
          ? '0 4px 20px rgba(232,121,43,0.15)'
          : '0 2px 8px rgba(0,0,0,0.05)',
      }}
    >
      {tier.featured && (
        <div
          className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full inline-block mb-3"
          style={{ background: 'var(--ep-primary)', color: 'white' }}
        >
          Most Popular
        </div>
      )}

      <div className="flex items-start justify-between mb-2">
        <h3 className="font-bold text-base" style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}>
          {tier.label}
        </h3>
        <div className="text-right">
          <span className="text-2xl font-bold" style={{ color: 'var(--ep-primary)' }}>
            ${tier.amount}
          </span>
          <span className="text-xs" style={{ color: 'var(--ep-muted)' }}>
            /{tier.frequency === 'one-time' ? 'once' : tier.frequency === 'monthly' ? 'mo' : 'yr'}
          </span>
        </div>
      </div>

      <p className="text-sm mb-3 leading-relaxed" style={{ color: 'var(--ep-muted)' }}>
        {tier.description}
      </p>

      <ul className="space-y-1.5">
        {tier.perks.map((perk) => (
          <li key={perk} className="flex items-start gap-2 text-xs" style={{ color: 'var(--ep-muted)' }}>
            <Check size={13} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--ep-least-concern)' }} />
            {perk}
          </li>
        ))}
      </ul>

      {selected && (
        <div
          className="mt-3 pt-3 text-xs font-semibold flex items-center gap-1"
          style={{ borderTop: '1px solid var(--ep-border)', color: 'var(--ep-primary)' }}
        >
          <Check size={13} /> Selected
        </div>
      )}
    </button>
  )
}
