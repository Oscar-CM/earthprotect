'use client'

import { useState, useTransition, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react'
import { ANIMALS } from '@/lib/constants'
import { AnimalCard } from '@/components/cards/AnimalCard'
import { CertificatePreview } from '@/components/shared/CertificatePreview'
import { SectionTitle } from '@/components/shared/SectionTitle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createAdoptionSubscription } from '@/app/actions/stripe'
import type { Animal, AdoptionTier } from '@/types'

type Step = 1 | 2 | 3

export function AdoptClient() {
  const params = useSearchParams()
  const preselectedSlug = params.get('animal')
  const preselectedTierId = params.get('tier')

  const [step, setStep] = useState<Step>(preselectedSlug ? 2 : 1)
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(
    preselectedSlug ? ANIMALS.find((a) => a.slug === preselectedSlug) ?? null : null
  )
  const [selectedTier, setSelectedTier] = useState<AdoptionTier | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  useEffect(() => {
    if (preselectedSlug && preselectedTierId && selectedAnimal) {
      const tier = selectedAnimal.adoptionTiers.find((t) => t.id === preselectedTierId)
      if (tier) { setSelectedTier(tier); setStep(3) }
    }
  }, [preselectedSlug, preselectedTierId, selectedAnimal])

  function handleSelectAnimal(animal: Animal) {
    setSelectedAnimal(animal)
    setSelectedTier(null)
    setStep(2)
  }

  function handleSelectTier(tier: AdoptionTier) {
    setSelectedTier(tier)
    setStep(3)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!selectedAnimal || !selectedTier) return
    if (!name.trim() || !email.trim()) {
      setError('Please fill in your name and email.')
      return
    }
    startTransition(() => {
      createAdoptionSubscription(
        selectedAnimal.slug,
        selectedAnimal.name,
        selectedTier.label,
        selectedTier.amount,
        selectedTier.interval,
        email,
        name
      ).catch((err) => {
        if (err?.digest?.startsWith('NEXT_REDIRECT')) return
        setError('Something went wrong. Please try again.')
      })
    })
  }

  const steps = ['Choose Animal', 'Choose Tier', 'Complete Adoption']

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ background: 'var(--ep-bg)' }}>
      {/* Header */}
      <div className="py-14 px-6 text-center" style={{ background: 'var(--ep-bg2)', borderBottom: '1px solid var(--ep-border)' }}>
        <div className="max-w-2xl mx-auto">
          <SectionTitle
            accent="Adopt"
            title="Adopt an African Animal"
            subtitle="Your monthly or annual sponsorship directly funds rangers, veterinary care, and habitat protection for your chosen animal."
            centered
          />
        </div>
      </div>

      {/* Step indicator */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex items-center justify-center gap-0">
          {steps.map((label, i) => {
            const stepNum = (i + 1) as Step
            const done = step > stepNum
            const active = step === stepNum
            return (
              <div key={label} className="flex items-center">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                    style={{
                      background: done ? 'var(--ep-secondary)' : active ? 'var(--ep-primary)' : 'var(--ep-bg2)',
                      color: done || active ? 'white' : 'var(--ep-muted)',
                      border: `2px solid ${done ? 'var(--ep-secondary)' : active ? 'var(--ep-primary)' : 'var(--ep-border)'}`,
                    }}
                  >
                    {done ? <Check size={14} /> : stepNum}
                  </div>
                  <span className="text-[11px] font-medium hidden sm:block" style={{ color: active ? 'var(--ep-primary)' : 'var(--ep-muted)' }}>
                    {label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className="h-0.5 w-16 md:w-24 mx-1 mb-4"
                    style={{ background: step > stepNum ? 'var(--ep-secondary)' : 'var(--ep-border)' }}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6">
        {/* Step 1: Choose animal */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold mb-6" style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}>
              Choose the animal you want to adopt
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {ANIMALS.slice(0, 12).map((animal) => (
                <div
                  key={animal.slug}
                  onClick={() => handleSelectAnimal(animal)}
                  className="cursor-pointer"
                >
                  <AnimalCard animal={animal} variant="grid" actionLabel="Select" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Choose tier */}
        {step === 2 && selectedAnimal && (
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-1.5 text-sm mb-6 hover:opacity-80"
              style={{ color: 'var(--ep-primary)' }}
            >
              <ArrowLeft size={15} /> Back to Animals
            </button>
            <div className="flex gap-4 items-center mb-6 p-4 rounded-xl" style={{ background: 'var(--ep-card)', border: '1px solid var(--ep-border)' }}>
              <div className="w-16 h-16 rounded-lg bg-cover bg-center flex-shrink-0" style={{ backgroundImage: `url(${selectedAnimal.thumbnailUrl})` }} />
              <div>
                <p className="font-bold text-lg" style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}>{selectedAnimal.name}</p>
                <p className="text-sm italic" style={{ color: 'var(--ep-muted)' }}>{selectedAnimal.species}</p>
              </div>
            </div>

            <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}>
              Choose your adoption tier
            </h2>
            <div className="space-y-4">
              {selectedAnimal.adoptionTiers.map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => handleSelectTier(tier)}
                  className="w-full text-left p-5 rounded-xl transition-all hover:border-opacity-100"
                  style={{ background: 'var(--ep-card)', border: `2px solid var(--ep-border)` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold" style={{ color: 'var(--ep-text)' }}>{tier.label}</span>
                    <span className="font-bold text-lg" style={{ color: 'var(--ep-primary)' }}>
                      ${tier.amount}<span className="text-sm font-normal" style={{ color: 'var(--ep-muted)' }}>/{tier.interval}</span>
                    </span>
                  </div>
                  <p className="text-sm mb-2" style={{ color: 'var(--ep-muted)' }}>{tier.description}</p>
                  <ul className="flex flex-wrap gap-2">
                    {tier.perks.map((perk) => (
                      <li key={perk} className="text-xs flex items-center gap-1" style={{ color: 'var(--ep-muted)' }}>
                        <Check size={12} style={{ color: 'var(--ep-least-concern)' }} /> {perk}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 flex justify-end">
                    <span className="text-xs font-semibold flex items-center gap-1" style={{ color: 'var(--ep-primary)' }}>
                      Select <ArrowRight size={13} />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Confirm & pay */}
        {step === 3 && selectedAnimal && selectedTier && (
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            {/* Preview */}
            <div>
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-1.5 text-sm mb-5 hover:opacity-80"
                style={{ color: 'var(--ep-primary)' }}
              >
                <ArrowLeft size={15} /> Back
              </button>
              <CertificatePreview animal={selectedAnimal} adopter={name || undefined} tier={selectedTier.label} />
            </div>

            {/* Form */}
            <div>
              <h2 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}>
                Complete Your Adoption
              </h2>
              <div
                className="p-4 rounded-lg mb-5 text-sm"
                style={{ background: 'color-mix(in srgb, var(--ep-primary) 10%, transparent)', color: 'var(--ep-text)' }}
              >
                <strong>{selectedAnimal.name}</strong> · {selectedTier.label} · <strong style={{ color: 'var(--ep-primary)' }}>${selectedTier.amount}/{selectedTier.interval}</strong>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder="Your full name (appears on certificate)"
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

                {error && <p className="text-sm" style={{ color: 'var(--ep-critical)' }}>{error}</p>}

                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full text-white font-semibold gap-2 py-5"
                  style={{ background: 'var(--ep-primary)', border: 'none' }}
                >
                  {isPending
                    ? <><Loader2 size={16} className="animate-spin" /> Processing…</>
                    : <>Adopt for ${selectedTier.amount}/{selectedTier.interval} <ArrowRight size={16} /></>}
                </Button>

                <p className="text-xs text-center" style={{ color: 'var(--ep-muted)' }}>
                  Secure recurring payment via Stripe. Cancel anytime.
                </p>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
