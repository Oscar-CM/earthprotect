'use client'

import { useState, useTransition } from 'react'
import { Check, Users, Leaf, Globe, Loader2, AlertCircle } from 'lucide-react'
import { SectionTitle } from '@/components/shared/SectionTitle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { MEMBERSHIP_TIERS } from '@/lib/constants'
import { submitJoinApplication } from '@/app/actions/join'
import type { MembershipRole } from '@/types'

const ROLE_ICONS: Record<MembershipRole, typeof Users> = {
  community: Users,
  volunteer: Leaf,
  ambassador: Globe,
}

export function JoinClient() {
  const [role, setRole] = useState<MembershipRole>('community')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    country: '',
    motivation: '',
    newsletter: true,
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    startTransition(async () => {
      const result = await submitJoinApplication({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        country: form.country,
        role,
        motivation: form.motivation,
        newsletter: form.newsletter,
      })
      if (result.success) {
        setSubmitted(true)
      } else {
        setError(result.error ?? 'Something went wrong. Please try again.')
      }
    })
  }

  if (submitted) {
    const tier = MEMBERSHIP_TIERS.find((t) => t.id === role)!
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center px-6" style={{ background: 'var(--ep-bg)' }}>
        <div className="text-center max-w-md">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: 'color-mix(in srgb, var(--ep-secondary) 15%, transparent)' }}
          >
            <Check size={36} style={{ color: 'var(--ep-secondary)' }} />
          </div>
          <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}>
            {tier.applicationRequired ? 'Application Submitted!' : 'Welcome to Earth Protect!'}
          </h2>
          <p className="text-base leading-relaxed mb-2" style={{ color: 'var(--ep-muted)' }}>
            Thank you, <strong style={{ color: 'var(--ep-text)' }}>{form.firstName}</strong>! You applied as a{' '}
            <strong style={{ color: 'var(--ep-primary)' }}>{tier.label}</strong>.
          </p>
          <p className="text-sm" style={{ color: 'var(--ep-muted)' }}>
            {tier.applicationRequired
              ? "We'll review your application and reach out within 3–5 business days. Check your inbox for a confirmation email."
              : 'Check your inbox for your welcome email and community access details.'}
          </p>
        </div>
      </div>
    )
  }

  const selectedTier = MEMBERSHIP_TIERS.find((t) => t.id === role)!

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ background: 'var(--ep-bg)' }}>
      {/* Header */}
      <div className="py-14 px-6 text-center" style={{ background: 'var(--ep-bg2)', borderBottom: '1px solid var(--ep-border)' }}>
        <div className="max-w-2xl mx-auto">
          <SectionTitle
            accent="Community"
            title="Join Earth Protect"
            subtitle="Become part of a global movement protecting Africa's wildlife. Find the role that fits you."
            centered
          />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Tier cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {MEMBERSHIP_TIERS.map((tier) => {
            const Icon = ROLE_ICONS[tier.id]
            const active = role === tier.id
            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => setRole(tier.id)}
                className="text-left p-5 rounded-xl transition-all focus:outline-none"
                style={{
                  background: active ? 'color-mix(in srgb, var(--ep-primary) 8%, var(--ep-card))' : 'var(--ep-card)',
                  border: `2px solid ${active ? 'var(--ep-primary)' : 'var(--ep-border)'}`,
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                  style={{ background: 'color-mix(in srgb, var(--ep-primary) 12%, transparent)' }}
                >
                  <Icon size={20} style={{ color: 'var(--ep-primary)' }} />
                </div>
                <p className="font-bold mb-1" style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}>
                  {tier.label}
                </p>
                <p className="text-xs mb-3" style={{ color: 'var(--ep-muted)' }}>
                  {tier.description}
                </p>
                <p className="text-xs font-semibold mb-2" style={{ color: 'var(--ep-accent)' }}>
                  Commitment: {tier.commitment}
                </p>
                <ul className="space-y-1">
                  {tier.perks.slice(0, 3).map((perk) => (
                    <li key={perk} className="text-xs flex items-start gap-1.5" style={{ color: 'var(--ep-muted)' }}>
                      <Check size={12} className="shrink-0 mt-0.5" style={{ color: 'var(--ep-least-concern)' }} />
                      {perk}
                    </li>
                  ))}
                  {tier.perks.length > 3 && (
                    <li className="text-xs" style={{ color: 'var(--ep-muted)' }}>
                      +{tier.perks.length - 3} more…
                    </li>
                  )}
                </ul>
                {tier.applicationRequired && (
                  <div
                    className="mt-3 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block"
                    style={{ background: 'color-mix(in srgb, var(--ep-accent) 15%, transparent)', color: 'var(--ep-accent)' }}
                  >
                    Application Required
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Form */}
        <div
          className="max-w-xl mx-auto p-6 md:p-8 rounded-2xl"
          style={{ background: 'var(--ep-card)', border: '1px solid var(--ep-border)' }}
        >
          <h3 className="text-lg font-bold mb-5" style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}>
            Apply as {selectedTier.label}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="First name"
                value={form.firstName}
                onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                required
                disabled={isPending}
                style={{ borderColor: 'var(--ep-border)' }}
              />
              <Input
                placeholder="Last name"
                value={form.lastName}
                onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                required
                disabled={isPending}
                style={{ borderColor: 'var(--ep-border)' }}
              />
            </div>
            <Input
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              required
              disabled={isPending}
              style={{ borderColor: 'var(--ep-border)' }}
            />
            <Input
              placeholder="Country"
              value={form.country}
              onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
              required
              disabled={isPending}
              style={{ borderColor: 'var(--ep-border)' }}
            />
            {role !== 'community' && (
              <Textarea
                placeholder="Tell us why you want to join as a volunteer/ambassador and any relevant experience…"
                value={form.motivation}
                onChange={(e) => setForm((f) => ({ ...f, motivation: e.target.value }))}
                required
                rows={4}
                disabled={isPending}
                style={{ borderColor: 'var(--ep-border)' }}
              />
            )}
            <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: 'var(--ep-muted)' }}>
              <input
                type="checkbox"
                checked={form.newsletter}
                onChange={(e) => setForm((f) => ({ ...f, newsletter: e.target.checked }))}
                className="w-4 h-4 rounded"
                style={{ accentColor: 'var(--ep-primary)' }}
              />
              Subscribe to our newsletter for conservation updates
            </label>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg text-sm" style={{ background: '#fee2e2', color: '#dc2626' }}>
                <AlertCircle size={15} />
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isPending}
              className="w-full text-white font-semibold py-5 gap-2"
              style={{ background: 'var(--ep-primary)', border: 'none' }}
            >
              {isPending
                ? <><Loader2 size={16} className="animate-spin" /> Submitting…</>
                : selectedTier.applicationRequired ? 'Submit Application' : 'Join Now'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
