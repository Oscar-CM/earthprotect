import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin, TrendingUp, TrendingDown, Minus, ArrowLeft, ChevronRight, AlertTriangle, Leaf } from 'lucide-react'
import { ANIMALS } from '@/lib/constants'
import { ConservationBadge } from '@/components/shared/ConservationBadge'
import { ProgressBar } from '@/components/shared/ProgressBar'
import { AnimalCard } from '@/components/cards/AnimalCard'
import { SocialShare } from '@/components/shared/SocialShare'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Animal } from '@/types'

export async function generateStaticParams() {
  let dbSlugs: string[] = []
  try {
    const { prisma } = await import('@/lib/prisma')
    const records = await prisma.animalRecord.findMany({ select: { slug: true }, where: { published: true } })
    dbSlugs = records.map((r: { slug: string }) => r.slug)
  } catch { /* ignore */ }
  const staticSlugs = ANIMALS.map((a) => a.slug)
  return [...new Set([...dbSlugs, ...staticSlugs])].map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const animal = ANIMALS.find((a) => a.slug === slug)
  if (!animal) return {}
  return {
    title: `${animal.name} — Earth Protect`,
    description: animal.description,
    openGraph: {
      title: `Protect the ${animal.name} — Earth Protect`,
      description: animal.description,
      images: [{ url: animal.imageUrl }],
    },
  }
}

function TrendIndicator({ trend }: { trend: Animal['population']['trend'] }) {
  if (trend === 'Increasing') {
    return (
      <span className="flex items-center gap-1 text-sm font-medium" style={{ color: 'var(--ep-least-concern)' }}>
        <TrendingUp size={16} /> Increasing
      </span>
    )
  }
  if (trend === 'Decreasing') {
    return (
      <span className="flex items-center gap-1 text-sm font-medium" style={{ color: 'var(--ep-endangered)' }}>
        <TrendingDown size={16} /> Decreasing
      </span>
    )
  }
  return (
    <span className="flex items-center gap-1 text-sm font-medium" style={{ color: 'var(--ep-muted)' }}>
      <Minus size={16} /> Stable
    </span>
  )
}

const statusColor: Record<string, string> = {
  'Extinct': '#1a1a1a',
  'Extinct in the Wild': '#4a1942',
  'Critically Endangered': '#dc2626',
  'Endangered': '#ea580c',
  'Vulnerable': '#ca8a04',
  'Near Threatened': '#2563eb',
  'Least Concern': '#16a34a',
}

async function getAnimal(slug: string): Promise<Animal | null> {
  try {
    const { prisma } = await import('@/lib/prisma')
    const r = await prisma.animalRecord.findUnique({ where: { slug, published: true } })
    if (r) return {
      slug: r.slug, name: r.name, species: r.species, commonName: r.commonName,
      region: r.region as Animal['region'], countries: r.countries,
      conservationStatus: r.conservationStatus as Animal['conservationStatus'],
      population: { current: r.populationCurrent, trend: r.populationTrend as Animal['population']['trend'], year: r.populationYear },
      habitat: r.habitat, description: r.description,
      extendedDescription: r.extendedDescription ?? undefined,
      imageUrl: r.imageUrl, thumbnailUrl: r.thumbnailUrl,
      facts: r.facts as Animal['facts'],
      threats: (r.threats as Animal['threats']) ?? undefined,
      ecoFacts: (r.ecoFacts as Animal['ecoFacts']) ?? undefined,
      adoptionTiers: r.adoptionTiers as Animal['adoptionTiers'],
      fundingGoal: r.fundingGoal, fundingRaised: r.fundingRaised,
    }
  } catch { /* fall through */ }
  return ANIMALS.find((a) => a.slug === slug) ?? null
}

export default async function AnimalProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const animal = await getAnimal(slug)
  if (!animal) notFound()

  const related = ANIMALS.filter((a) => a.region === animal.region && a.slug !== animal.slug).slice(0, 3)
  const pageUrl = `${process.env.NEXT_PUBLIC_BASE_URL ?? 'https://earthprotect.org'}/animals/${animal.slug}`
  const statusBg = statusColor[animal.conservationStatus] ?? '#6b7280'

  return (
    <div className="min-h-screen pt-20" style={{ background: 'var(--ep-bg)' }}>
      {/* Hero image */}
      <div className="relative h-80 md:h-[480px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${animal.imageUrl})` }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.65) 100%)' }}
        />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-6xl mx-auto">
            <nav className="flex items-center gap-1.5 text-xs text-white/60 mb-4">
              <Link href="/" className="hover:text-white">Home</Link>
              <ChevronRight size={12} />
              <Link href="/animals" className="hover:text-white">Animals</Link>
              <ChevronRight size={12} />
              <span className="text-white">{animal.name}</span>
            </nav>
            <ConservationBadge status={animal.conservationStatus} size="md" />
            <h1
              className="text-3xl md:text-5xl font-bold text-white mt-2"
              style={{ fontFamily: 'var(--font-lora)' }}
            >
              {animal.name}
            </h1>
            <p className="text-white/70 italic mt-1">{animal.species}</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="md:col-span-2 space-y-8">
            <Link
              href="/animals"
              className="inline-flex items-center gap-1.5 text-sm hover:opacity-80 transition-opacity"
              style={{ color: 'var(--ep-primary)' }}
            >
              <ArrowLeft size={16} /> Back to Animals
            </Link>

            {/* Conservation status banner */}
            <div
              className="flex items-center gap-3 p-4 rounded-xl"
              style={{
                background: `${statusBg}18`,
                border: `1px solid ${statusBg}40`,
              }}
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ background: statusBg }}
              />
              <div>
                <p className="text-sm font-semibold" style={{ color: statusBg }}>
                  {animal.conservationStatus}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--ep-muted)' }}>
                  IUCN Red List status · Population {animal.population.trend.toLowerCase()} as of {animal.population.year}
                  {animal.population.current ? ` · Est. ${animal.population.current.toLocaleString()} individuals` : ''}
                </p>
              </div>
            </div>

            {/* About */}
            <div
              className="p-6 rounded-xl"
              style={{ background: 'var(--ep-card)', border: '1px solid var(--ep-border)' }}
            >
              <h2
                className="text-xl font-bold mb-3"
                style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}
              >
                About the {animal.name}
              </h2>
              <p className="text-base leading-relaxed" style={{ color: 'var(--ep-muted)' }}>
                {animal.description}
              </p>
              {animal.extendedDescription && (
                <p className="text-base leading-relaxed mt-3" style={{ color: 'var(--ep-muted)' }}>
                  {animal.extendedDescription}
                </p>
              )}
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl text-center" style={{ background: 'var(--ep-card)', border: '1px solid var(--ep-border)' }}>
                <p className="text-xs mb-1" style={{ color: 'var(--ep-muted)' }}>Region</p>
                <p className="font-semibold text-sm flex items-center justify-center gap-1" style={{ color: 'var(--ep-text)' }}>
                  <MapPin size={12} style={{ color: 'var(--ep-primary)' }} />
                  {animal.region}
                </p>
              </div>
              <div className="p-4 rounded-xl text-center" style={{ background: 'var(--ep-card)', border: '1px solid var(--ep-border)' }}>
                <p className="text-xs mb-1" style={{ color: 'var(--ep-muted)' }}>Population</p>
                <p className="font-semibold text-sm" style={{ color: 'var(--ep-text)' }}>
                  {animal.population.current ? animal.population.current.toLocaleString() : 'Unknown'}
                </p>
              </div>
              <div className="p-4 rounded-xl text-center" style={{ background: 'var(--ep-card)', border: '1px solid var(--ep-border)' }}>
                <p className="text-xs mb-1" style={{ color: 'var(--ep-muted)' }}>Trend</p>
                <div className="flex justify-center">
                  <TrendIndicator trend={animal.population.trend} />
                </div>
              </div>
              <div className="p-4 rounded-xl text-center" style={{ background: 'var(--ep-card)', border: '1px solid var(--ep-border)' }}>
                <p className="text-xs mb-1" style={{ color: 'var(--ep-muted)' }}>Data Year</p>
                <p className="font-semibold text-sm" style={{ color: 'var(--ep-text)' }}>
                  {animal.population.year}
                </p>
              </div>
            </div>

            {/* Key Facts */}
            <div
              className="p-6 rounded-xl"
              style={{ background: 'var(--ep-card)', border: '1px solid var(--ep-border)' }}
            >
              <h2
                className="text-xl font-bold mb-4"
                style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}
              >
                Key Facts
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {animal.facts.map((fact) => (
                  <div
                    key={fact.label}
                    className="flex items-center gap-3 p-3 rounded-lg"
                    style={{ background: 'var(--ep-bg2)' }}
                  >
                    <span className="text-xs font-semibold uppercase tracking-wide w-28 flex-shrink-0" style={{ color: 'var(--ep-muted)' }}>
                      {fact.label}
                    </span>
                    <span className="text-sm font-medium" style={{ color: 'var(--ep-text)' }}>
                      {fact.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Threats */}
            {animal.threats && animal.threats.length > 0 && (
              <div
                className="p-6 rounded-xl"
                style={{ background: 'var(--ep-card)', border: '1px solid var(--ep-border)' }}
              >
                <h2
                  className="text-xl font-bold mb-4 flex items-center gap-2"
                  style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}
                >
                  <AlertTriangle size={20} style={{ color: '#ea580c' }} />
                  Threats to Survival
                </h2>
                <div className="space-y-3">
                  {animal.threats.map((threat) => (
                    <div
                      key={threat.title}
                      className="p-4 rounded-lg"
                      style={{ background: '#fff7ed', border: '1px solid #fed7aa' }}
                    >
                      <p className="font-semibold text-sm mb-1" style={{ color: '#c2410c' }}>
                        {threat.title}
                      </p>
                      <p className="text-sm leading-relaxed" style={{ color: '#78350f' }}>
                        {threat.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Eco Facts */}
            {animal.ecoFacts && animal.ecoFacts.length > 0 && (
              <div
                className="p-6 rounded-xl"
                style={{ background: 'var(--ep-card)', border: '1px solid var(--ep-border)' }}
              >
                <h2
                  className="text-xl font-bold mb-4 flex items-center gap-2"
                  style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}
                >
                  <Leaf size={20} style={{ color: 'var(--ep-primary)' }} />
                  Ecosystem Role
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {animal.ecoFacts.map((ef) => (
                    <div
                      key={ef.label}
                      className="p-4 rounded-xl"
                      style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{ef.emoji}</span>
                        <p className="font-semibold text-sm" style={{ color: '#166534' }}>
                          {ef.label}
                        </p>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: '#14532d' }}>
                        {ef.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Habitat */}
            <div>
              <h2 className="text-xl font-bold mb-3" style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}>
                Habitat Types
              </h2>
              <div className="flex flex-wrap gap-2">
                {animal.habitat.map((h) => (
                  <Badge
                    key={h}
                    variant="secondary"
                    className="text-sm"
                    style={{ background: 'var(--ep-bg2)', color: 'var(--ep-text)', borderColor: 'var(--ep-border)' }}
                  >
                    {h}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Countries */}
            <div>
              <h2 className="text-xl font-bold mb-3" style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}>
                Found In
              </h2>
              <div className="flex flex-wrap gap-2">
                {animal.countries.map((c) => (
                  <Badge
                    key={c}
                    variant="outline"
                    className="text-sm"
                    style={{ borderColor: 'var(--ep-border)', color: 'var(--ep-muted)' }}
                  >
                    {c}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Environmental context card */}
            <div
              className="p-6 rounded-xl"
              style={{ background: 'linear-gradient(135deg, #0f4c2e 0%, #1a5c3a 100%)' }}
            >
              <h2
                className="text-xl font-bold text-white mb-2"
                style={{ fontFamily: 'var(--font-lora)' }}
              >
                Why Africa's Wildlife Matters
              </h2>
              <p className="text-sm leading-relaxed text-white/80 mb-4">
                Africa's megafauna are not just iconic — they are ecosystem engineers. The loss of a single keystone species can trigger cascading collapses across entire biomes. Elephants create waterholes, lions regulate prey, and predators maintain the biodiversity that keeps Africa's grasslands and forests functioning.
              </p>
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  { value: '20%', label: 'of Earth\'s bird species in Africa' },
                  { value: '25%', label: 'of mammals found in Africa' },
                  { value: '3,000+', label: 'endemic plant species at risk' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-white/70 mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Social sharing */}
            <div
              className="p-5 rounded-xl"
              style={{ background: 'var(--ep-card)', border: '1px solid var(--ep-border)' }}
            >
              <p className="text-sm font-semibold mb-3" style={{ color: 'var(--ep-text)' }}>
                Help spread the word about the {animal.name}
              </p>
              <SocialShare
                url={pageUrl}
                title={`The ${animal.name} needs your help — ${animal.conservationStatus} with only ${animal.population.current?.toLocaleString() ?? 'few'} left in the wild.`}
              />
            </div>

            {/* Related animals */}
            {related.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}>
                  More from {animal.region}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {related.map((a) => (
                    <AnimalCard key={a.slug} animal={a} variant="compact" />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar — Adopt panel */}
          <div className="md:col-span-1">
            <div
              className="sticky top-24 p-6 rounded-xl space-y-5"
              style={{ background: 'var(--ep-card)', border: '1px solid var(--ep-border)' }}
            >
              <div>
                <h3
                  className="text-lg font-bold mb-1"
                  style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}
                >
                  Adopt a {animal.name}
                </h3>
                <p className="text-sm" style={{ color: 'var(--ep-muted)' }}>
                  Your monthly support directly funds this animal&apos;s protection.
                </p>
              </div>

              <ProgressBar
                current={animal.fundingRaised}
                goal={animal.fundingGoal}
                label="Funding Progress"
              />

              <div className="space-y-3">
                {animal.adoptionTiers.map((tier) => (
                  <Link key={tier.id} href={`/adopt?animal=${animal.slug}&tier=${tier.id}`}>
                    <div
                      className="p-4 rounded-lg cursor-pointer transition-all hover:opacity-90"
                      style={{
                        border: '2px solid var(--ep-border)',
                        background: 'var(--ep-bg2)',
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-sm" style={{ color: 'var(--ep-text)' }}>
                          {tier.label}
                        </p>
                        <p className="font-bold text-base" style={{ color: 'var(--ep-primary)' }}>
                          ${tier.amount}
                          <span className="text-xs font-normal" style={{ color: 'var(--ep-muted)' }}>
                            /{tier.interval}
                          </span>
                        </p>
                      </div>
                      <p className="text-xs mb-2" style={{ color: 'var(--ep-muted)' }}>
                        {tier.description}
                      </p>
                      <ul className="space-y-0.5">
                        {tier.perks.map((perk) => (
                          <li key={perk} className="text-xs flex items-center gap-1" style={{ color: 'var(--ep-muted)' }}>
                            <span style={{ color: 'var(--ep-least-concern)' }}>✓</span> {perk}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Link>
                ))}
              </div>

              <Link href={`/adopt?animal=${animal.slug}`}>
                <Button
                  className="w-full text-white font-semibold"
                  style={{ background: 'var(--ep-primary)', border: 'none' }}
                >
                  Adopt Now
                </Button>
              </Link>

              <Link href="/donate">
                <Button
                  variant="outline"
                  className="w-full"
                  style={{ borderColor: 'var(--ep-border)', color: 'var(--ep-text)' }}
                >
                  One-Time Donation
                </Button>
              </Link>

              {/* Quick facts sidebar */}
              <div className="pt-2" style={{ borderTop: '1px solid var(--ep-border)' }}>
                <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--ep-muted)' }}>
                  Quick Stats
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span style={{ color: 'var(--ep-muted)' }}>Status</span>
                    <span className="font-medium" style={{ color: statusBg }}>{animal.conservationStatus}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span style={{ color: 'var(--ep-muted)' }}>Region</span>
                    <span className="font-medium" style={{ color: 'var(--ep-text)' }}>{animal.region}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span style={{ color: 'var(--ep-muted)' }}>Population trend</span>
                    <span className="font-medium" style={{ color: 'var(--ep-text)' }}>{animal.population.trend}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
