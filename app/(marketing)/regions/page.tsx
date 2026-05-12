import Link from 'next/link'
import { MapPin, AlertTriangle } from 'lucide-react'
import { SectionTitle } from '@/components/shared/SectionTitle'
import { ScrollReveal } from '@/components/shared/ScrollReveal'
import { Badge } from '@/components/ui/badge'
import { REGIONS, ANIMALS } from '@/lib/constants'
import type { ThreatLevel } from '@/types'

export const metadata = {
  title: 'African Regions',
  description: 'Explore the 5 regions of Africa, their ecosystems, wildlife, and conservation challenges.',
}

const THREAT_COLORS: Record<ThreatLevel, string> = {
  Critical: 'var(--ep-critical)',
  High: 'var(--ep-endangered)',
  Moderate: 'var(--ep-vulnerable)',
  Low: 'var(--ep-least-concern)',
}

export default function RegionsPage() {
  return (
    <div className="min-h-screen pt-24" style={{ background: 'var(--ep-bg)' }}>
      {/* Header */}
      <div className="py-16 px-6 text-center" style={{ background: 'var(--ep-bg2)', borderBottom: '1px solid var(--ep-border)' }}>
        <div className="max-w-2xl mx-auto">
          <SectionTitle
            accent="Geography"
            title="The Regions of Africa"
            subtitle="Africa's five regions are each home to unique ecosystems, wildlife, and conservation challenges. Explore what makes each region extraordinary — and how we protect it."
            centered
          />
        </div>
      </div>

      {/* Simplified Africa map visual */}
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
          {REGIONS.map((region) => (
            <a
              key={region.id}
              href={`#${region.id}`}
              className="p-3 rounded-xl text-center transition-all hover:scale-105 hover:shadow-md"
              style={{
                background: 'var(--ep-card)',
                border: `2px solid ${THREAT_COLORS[region.threatLevel]}30`,
              }}
            >
              <div
                className="w-3 h-3 rounded-full mx-auto mb-2"
                style={{ background: THREAT_COLORS[region.threatLevel] }}
              />
              <p className="text-xs font-semibold" style={{ color: 'var(--ep-text)' }}>
                {region.name}
              </p>
              <p className="text-[10px] mt-0.5" style={{ color: THREAT_COLORS[region.threatLevel] }}>
                {region.threatLevel} threat
              </p>
            </a>
          ))}
        </div>
      </div>

      {/* Region sections */}
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-16">
        {REGIONS.map((region, i) => {
          const featuredAnimals = region.countries
            .flatMap((c) => c.featuredAnimals)
            .filter((slug, idx, arr) => arr.indexOf(slug) === idx)
            .slice(0, 4)
            .map((slug) => ANIMALS.find((a) => a.slug === slug))
            .filter(Boolean)

          return (
            <ScrollReveal key={region.id} id={region.id as string}>
              <div
                className="rounded-2xl overflow-hidden"
                style={{ border: '1px solid var(--ep-border)', background: 'var(--ep-card)' }}
              >
                {/* Hero image */}
                <div
                  className="relative h-56 bg-cover bg-center"
                  style={{ backgroundImage: `url(${region.imageUrl})` }}
                >
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)' }} />
                  <div className="absolute bottom-0 left-0 p-6">
                    <div
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mb-2"
                      style={{
                        background: `color-mix(in srgb, ${THREAT_COLORS[region.threatLevel]} 20%, transparent)`,
                        color: THREAT_COLORS[region.threatLevel],
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      <AlertTriangle size={11} /> {region.threatLevel} Threat
                    </div>
                    <h2
                      className="text-2xl font-bold text-white"
                      style={{ fontFamily: 'var(--font-lora)' }}
                    >
                      {region.name}
                    </h2>
                  </div>
                </div>

                <div className="p-6 grid md:grid-cols-3 gap-6">
                  {/* Description */}
                  <div className="md:col-span-2">
                    <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--ep-muted)' }}>
                      {region.description}
                    </p>

                    <div className="mb-4">
                      <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--ep-accent)' }}>
                        Key Habitats
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {region.keyHabitats.map((h) => (
                          <Badge key={h} variant="secondary" style={{ background: 'var(--ep-bg2)', color: 'var(--ep-text)' }}>
                            {h}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {featuredAnimals.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--ep-accent)' }}>
                          Featured Wildlife
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {featuredAnimals.map((animal) => animal && (
                            <Link
                              key={animal.slug}
                              href={`/animals/${animal.slug}`}
                              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm hover:opacity-80 transition-opacity"
                              style={{ background: 'var(--ep-bg2)', color: 'var(--ep-text)', border: '1px solid var(--ep-border)' }}
                            >
                              {animal.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Countries */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--ep-accent)' }}>
                      Countries ({region.countries.length})
                    </p>
                    <div className="space-y-1.5">
                      {region.countries.map((country) => (
                        <div key={country.code} className="flex items-center gap-2 text-sm" style={{ color: 'var(--ep-text)' }}>
                          <span className="text-base">{country.flag}</span>
                          <span>{country.name}</span>
                          {country.habitat.slice(0, 1).map((h) => (
                            <span key={h} className="text-[10px]" style={{ color: 'var(--ep-muted)' }}>· {h}</span>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-5 flex gap-3">
                  <Link href={`/animals?region=${encodeURIComponent(region.name)}`}>
                    <button
                      className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg transition-all"
                      style={{ background: 'var(--ep-primary)', color: 'white', border: 'none' }}
                    >
                      <MapPin size={14} /> View Wildlife
                    </button>
                  </Link>
                  <Link href="/donate">
                    <button
                      className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg transition-all"
                      style={{ background: 'var(--ep-bg2)', color: 'var(--ep-text)', border: '1px solid var(--ep-border)' }}
                    >
                      Protect this Region
                    </button>
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          )
        })}
      </div>
    </div>
  )
}
