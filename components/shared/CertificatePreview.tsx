import { Leaf, Award } from 'lucide-react'
import type { Animal } from '@/types'

interface CertificatePreviewProps {
  animal: Animal
  adopter?: string
  tier?: string
}

export function CertificatePreview({ animal, adopter, tier }: CertificatePreviewProps) {
  return (
    <div
      className="relative rounded-xl overflow-hidden p-8 text-center"
      style={{
        background: 'linear-gradient(135deg, #FAF0E0 0%, #FFF8EE 50%, #FAF0E0 100%)',
        border: '3px solid var(--ep-accent)',
        boxShadow: '0 8px 32px rgba(139,94,60,0.15)',
        color: '#2C1F0E',
      }}
    >
      {/* Decorative corners */}
      <div className="absolute top-3 left-3 opacity-30">
        <Leaf size={20} color="var(--ep-accent)" />
      </div>
      <div className="absolute top-3 right-3 opacity-30">
        <Leaf size={20} color="var(--ep-accent)" style={{ transform: 'scaleX(-1)' }} />
      </div>
      <div className="absolute bottom-3 left-3 opacity-30">
        <Leaf size={20} color="var(--ep-accent)" style={{ transform: 'rotate(180deg)' }} />
      </div>
      <div className="absolute bottom-3 right-3 opacity-30">
        <Leaf size={20} color="var(--ep-accent)" style={{ transform: 'rotate(180deg) scaleX(-1)' }} />
      </div>

      <div className="flex justify-center mb-3">
        <Award size={32} color="var(--ep-primary)" />
      </div>

      <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--ep-accent)' }}>
        Certificate of Adoption
      </p>
      <h3
        className="text-2xl font-bold mb-1"
        style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-accent)' }}
      >
        Earth Protect
      </h3>

      <div className="my-4 h-px" style={{ background: 'var(--ep-accent)', opacity: 0.3 }} />

      <p className="text-sm mb-1" style={{ color: '#5C3D1A' }}>
        This certifies that
      </p>
      <p
        className="text-xl font-bold mb-1"
        style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-primary)' }}
      >
        {adopter || 'Your Name Here'}
      </p>
      <p className="text-sm mb-3" style={{ color: '#5C3D1A' }}>
        has officially adopted a
      </p>
      <p
        className="text-2xl font-bold"
        style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-accent)' }}
      >
        {animal.name}
      </p>
      <p className="text-xs italic mb-4" style={{ color: '#7A6C5D' }}>
        {animal.species}
      </p>

      {tier && (
        <div
          className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4"
          style={{ background: 'var(--ep-primary)', color: 'white' }}
        >
          {tier}
        </div>
      )}

      <div className="my-4 h-px" style={{ background: 'var(--ep-accent)', opacity: 0.3 }} />

      <p className="text-[10px] leading-relaxed" style={{ color: '#7A6C5D' }}>
        Your adoption helps protect this magnificent animal and its natural habitat across Africa.
        Together, we keep the wild alive.
      </p>
    </div>
  )
}
