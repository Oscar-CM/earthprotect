import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SectionTitle } from '@/components/shared/SectionTitle'
import { ScrollReveal } from '@/components/shared/ScrollReveal'
import { AnimalCard } from '@/components/cards/AnimalCard'
import { ANIMALS } from '@/lib/constants'

const FEATURED_SLUGS = [
  'african-elephant',
  'mountain-gorilla',
  'black-rhino',
  'cheetah',
  'african-wild-dog',
  'african-penguin',
]

export function FeaturedAnimalsSection() {
  const featured = FEATURED_SLUGS.map((s) => ANIMALS.find((a) => a.slug === s)).filter(Boolean) as typeof ANIMALS

  return (
    <section className="py-24 px-6" style={{ background: 'var(--ep-bg2)' }}>
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <SectionTitle
              accent="Wildlife"
              title="Animals That Need You"
              subtitle="Meet some of Africa's most iconic — and most threatened — species."
            />
            <Link
              href="/animals"
              className="flex items-center gap-1 text-sm font-semibold hover:opacity-80 transition-opacity whitespace-nowrap"
              style={{ color: 'var(--ep-primary)' }}
            >
              View All Animals <ArrowRight size={16} />
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((animal, i) => (
            <ScrollReveal key={animal.slug} threshold={0.08 + i * 0.02}>
              <AnimalCard animal={animal} variant={i === 0 ? 'featured' : 'grid'} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
