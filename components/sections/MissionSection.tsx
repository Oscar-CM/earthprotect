import { ScrollReveal } from '@/components/shared/ScrollReveal'
import { SectionTitle } from '@/components/shared/SectionTitle'
import { Shield, TreePine, Globe } from 'lucide-react'

const PILLARS = [
  {
    icon: Shield,
    title: 'Protect',
    description:
      'We work with local rangers, governments, and communities to combat poaching, habitat destruction, and illegal wildlife trade across Africa.',
  },
  {
    icon: TreePine,
    title: 'Restore',
    description:
      'From reforestation in Central Africa to wetland rehabilitation in East Africa, we restore degraded ecosystems to their natural abundance.',
  },
  {
    icon: Globe,
    title: 'Educate',
    description:
      'We empower local communities with knowledge, resources, and economic alternatives that make conservation a sustainable way of life.',
  },
]

export function MissionSection() {
  return (
    <section className="py-24 px-6" style={{ background: 'var(--ep-bg)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <ScrollReveal>
            <SectionTitle
              accent="Our Mission"
              title="A Continent Worth Fighting For"
              subtitle="Africa is home to the richest diversity of wildlife on Earth. Yet today, species disappear faster than at any time in human history. Earth Protect exists to change that — through science, community, and compassion."
            />
            <p className="text-base leading-relaxed" style={{ color: 'var(--ep-muted)' }}>
              Founded by conservationists, scientists, and local leaders across 12 African nations,
              we believe that protecting wildlife is inseparable from supporting the communities who live
              alongside it. Your support makes direct, measurable impact — from anti-poaching patrols
              to school education programs to habitat corridor restoration.
            </p>
          </ScrollReveal>

          {/* Pillars */}
          <div className="space-y-6">
            {PILLARS.map((pillar, i) => (
              <ScrollReveal key={pillar.title} threshold={0.1 + i * 0.05}>
                <div
                  className="flex gap-4 p-5 rounded-xl"
                  style={{
                    background: 'var(--ep-card)',
                    border: '1px solid var(--ep-border)',
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: 'color-mix(in srgb, var(--ep-primary) 12%, transparent)' }}
                  >
                    <pillar.icon size={20} style={{ color: 'var(--ep-primary)' }} />
                  </div>
                  <div>
                    <h3
                      className="font-bold text-base mb-1"
                      style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}
                    >
                      {pillar.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--ep-muted)' }}>
                      {pillar.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
