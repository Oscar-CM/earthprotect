import Link from 'next/link'
import { TrendingUp, TrendingDown, Minus, MapPin, ArrowRight } from 'lucide-react'
import { ConservationBadge } from '@/components/shared/ConservationBadge'
import type { Animal } from '@/types'

interface AnimalCardProps {
  animal: Animal
  variant?: 'grid' | 'featured' | 'compact'
  actionLabel?: string
}

function TrendIcon({ trend }: { trend: Animal['population']['trend'] }) {
  if (trend === 'Increasing') return <TrendingUp size={14} style={{ color: 'var(--ep-least-concern)' }} />
  if (trend === 'Decreasing') return <TrendingDown size={14} style={{ color: 'var(--ep-endangered)' }} />
  return <Minus size={14} style={{ color: 'var(--ep-muted)' }} />
}

export function AnimalCard({ animal, variant = 'grid', actionLabel = 'Learn More' }: AnimalCardProps) {
  if (variant === 'compact') {
    return (
      <Link href={`/animals/${animal.slug}`}>
        <div
          className="flex gap-3 p-3 rounded-lg hover:opacity-90 transition-opacity"
          style={{ background: 'var(--ep-bg2)', border: '1px solid var(--ep-border)' }}
        >
          <div
            className="w-14 h-14 rounded-lg bg-cover bg-center flex-shrink-0"
            style={{ backgroundImage: `url(${animal.thumbnailUrl})` }}
          />
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate" style={{ color: 'var(--ep-text)' }}>
              {animal.name}
            </p>
            <ConservationBadge status={animal.conservationStatus} size="sm" />
          </div>
        </div>
      </Link>
    )
  }

  return (
    <div
      className="group rounded-xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      style={{
        background: 'var(--ep-card)',
        border: '1px solid var(--ep-border)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      }}
    >
      {/* Clickable image */}
      <Link href={`/animals/${animal.slug}`} className="block relative overflow-hidden" style={{ height: variant === 'featured' ? '240px' : '180px' }}>
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url(${animal.thumbnailUrl})` }}
        />
        {/* Subtle overlay on hover */}
        <div
          className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          style={{ background: 'rgba(0,0,0,0.15)' }}
        />
        <div className="absolute top-3 left-3">
          <ConservationBadge status={animal.conservationStatus} size="sm" />
        </div>
        {/* View detail hint */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span
            className="px-3 py-1.5 rounded-full text-xs font-semibold text-white backdrop-blur-sm"
            style={{ background: 'rgba(45,106,79,0.85)' }}
          >
            View Details →
          </span>
        </div>
      </Link>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <Link href={`/animals/${animal.slug}`}>
          <h3
            className="font-bold text-base mb-1 hover:opacity-80 transition-opacity"
            style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}
          >
            {animal.name}
          </h3>
        </Link>
        <p className="text-xs italic mb-2" style={{ color: 'var(--ep-muted)' }}>
          {animal.species}
        </p>

        {variant === 'featured' && (
          <p className="text-sm mb-3 leading-relaxed line-clamp-2" style={{ color: 'var(--ep-muted)' }}>
            {animal.description}
          </p>
        )}

        <div className="flex items-center gap-3 mb-3 text-xs" style={{ color: 'var(--ep-muted)' }}>
          <span className="flex items-center gap-1">
            <MapPin size={12} />
            {animal.region}
          </span>
          <span className="flex items-center gap-1">
            <TrendIcon trend={animal.population.trend} />
            {animal.population.trend}
          </span>
        </div>

        {animal.population.current && (
          <p className="text-xs mb-4" style={{ color: 'var(--ep-muted)' }}>
            Est. population:{' '}
            <span className="font-semibold" style={{ color: 'var(--ep-text)' }}>
              {animal.population.current.toLocaleString()}
            </span>
          </p>
        )}

        <div className="mt-auto flex gap-2">
          <Link href={`/animals/${animal.slug}`} className="flex-1">
            <button
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 hover:opacity-90 hover:shadow-md"
              style={{
                background: 'var(--ep-primary)',
                color: 'white',
              }}
            >
              {actionLabel}
              <ArrowRight size={13} />
            </button>
          </Link>
          <Link href={`/adopt?animal=${animal.slug}`} className="flex-1">
            <button
              className="w-full px-3 py-2 rounded-lg text-xs font-semibold border transition-all duration-200 hover:opacity-80"
              style={{
                borderColor: 'var(--ep-primary)',
                color: 'var(--ep-primary)',
                background: 'transparent',
              }}
            >
              Adopt
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
