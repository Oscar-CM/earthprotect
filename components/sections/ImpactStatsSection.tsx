import { ScrollReveal } from '@/components/shared/ScrollReveal'
import { Shield, TreePine, Globe, Users } from 'lucide-react'

const STATS = [
  { value: '1,200+', label: 'Animals Protected', sub: 'Across 20 species', icon: Shield },
  { value: '850K', label: 'Hectares Conserved', sub: 'Habitat protected & restored', icon: TreePine },
  { value: '42', label: 'Partner Countries', sub: 'Pan-African network', icon: Globe },
  { value: '18,000+', label: 'Community Members', sub: 'Global supporters', icon: Users },
]

export function ImpactStatsSection() {
  return (
    <section
      className="py-20 px-6"
      style={{ background: 'var(--ep-secondary)' }}
    >
      <div className="max-w-6xl mx-auto">
        <ScrollReveal className="text-center mb-12">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-2"
            style={{ color: 'rgba(255,255,255,0.6)' }}
          >
            Our Impact
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold text-white"
            style={{ fontFamily: 'var(--font-lora)' }}
          >
            Conservation in Numbers
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((stat, i) => (
            <ScrollReveal key={stat.label} threshold={0.1 + i * 0.05}>
              <div className="text-center p-6 rounded-xl" style={{ background: 'rgba(255,255,255,0.10)' }}>
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'rgba(255,255,255,0.15)' }}
                >
                  <stat.icon size={22} className="text-white" />
                </div>
                <p
                  className="text-3xl md:text-4xl font-bold text-white mb-1"
                  style={{ fontFamily: 'var(--font-lora)' }}
                >
                  {stat.value}
                </p>
                <p className="text-sm font-semibold text-white/80">{stat.label}</p>
                <p className="text-xs text-white/50 mt-1">{stat.sub}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
