import { SectionTitle } from '@/components/shared/SectionTitle'
import { DonationForm } from '@/components/forms/DonationForm'
import { Shield, TreePine, Users } from 'lucide-react'

export const metadata = {
  title: 'Donate',
  description: 'Make a one-time or recurring donation to protect African wildlife and habitats.',
}

const IMPACT_ITEMS = [
  { icon: Shield, text: '$10/mo funds one anti-poaching patrol day' },
  { icon: TreePine, text: '$25/mo plants 50 trees in degraded habitat' },
  { icon: Users, text: '$50/mo supports a community ranger for a week' },
]

export default function DonatePage() {
  return (
    <div className="min-h-screen pt-24 pb-16" style={{ background: 'var(--ep-bg)' }}>
      {/* Header */}
      <div
        className="py-16 px-6 text-center mb-10"
        style={{ background: 'var(--ep-bg2)', borderBottom: '1px solid var(--ep-border)' }}
      >
        <div className="max-w-2xl mx-auto">
          <SectionTitle
            accent="Make a Difference"
            title="Donate to Earth Protect"
            subtitle="Every dollar you give goes directly to protecting Africa's wildlife and wild places. Choose how you want to give and the frequency that works for you."
            centered
          />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Form */}
          <div className="md:col-span-2">
            <div
              className="p-6 md:p-8 rounded-2xl"
              style={{ background: 'var(--ep-card)', border: '1px solid var(--ep-border)' }}
            >
              <DonationForm />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div
              className="p-5 rounded-xl"
              style={{ background: 'var(--ep-card)', border: '1px solid var(--ep-border)' }}
            >
              <h3
                className="font-bold text-base mb-4"
                style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}
              >
                Your Impact
              </h3>
              <ul className="space-y-3">
                {IMPACT_ITEMS.map((item) => (
                  <li key={item.text} className="flex gap-3 items-start">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: 'color-mix(in srgb, var(--ep-primary) 12%, transparent)' }}
                    >
                      <item.icon size={16} style={{ color: 'var(--ep-primary)' }} />
                    </div>
                    <p className="text-sm leading-snug" style={{ color: 'var(--ep-muted)' }}>
                      {item.text}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="p-5 rounded-xl"
              style={{ background: 'var(--ep-secondary)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <p
                className="text-sm font-bold text-white mb-1"
                style={{ fontFamily: 'var(--font-lora)' }}
              >
                100% Transparency
              </p>
              <p className="text-xs text-white/70 leading-relaxed">
                We publish annual reports showing exactly where every dollar goes.
                Zero overhead model — 95% of donations fund direct conservation work.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
