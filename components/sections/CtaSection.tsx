import Link from 'next/link'
import { Leaf, Heart, Users } from 'lucide-react'
import { ScrollReveal } from '@/components/shared/ScrollReveal'
import { Button } from '@/components/ui/button'

const ACTIONS = [
  {
    icon: Leaf,
    title: 'Adopt an Animal',
    description:
      'Choose a species to sponsor. Your monthly contribution funds rangers, veterinary care, and habitat protection for a specific animal.',
    cta: 'Start Adopting',
    href: '/adopt',
    bg: 'var(--ep-primary)',
  },
  {
    icon: Heart,
    title: 'Make a Donation',
    description:
      'Give a one-time gift or set up a recurring donation. Every dollar goes directly to conservation programs across Africa.',
    cta: 'Donate Now',
    href: '/donate',
    bg: 'var(--ep-secondary)',
  },
  {
    icon: Users,
    title: 'Join Our Movement',
    description:
      'Become a community member, volunteer for field work, or apply to be an Earth Protect ambassador in your region.',
    cta: 'Join Us',
    href: '/join',
    bg: 'var(--ep-accent)',
  },
]

export function CtaSection() {
  return (
    <section className="py-24 px-6" style={{ background: 'var(--ep-bg)' }}>
      <div className="max-w-6xl mx-auto">
        <ScrollReveal className="text-center mb-14">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-2"
            style={{ color: 'var(--ep-primary)' }}
          >
            Take Action
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold mb-3"
            style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}
          >
            Choose Your Way to Help
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--ep-muted)' }}>
            There is no small act when it comes to protecting life. Find the way that works for you.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ACTIONS.map((action, i) => (
            <ScrollReveal key={action.title} threshold={0.1 + i * 0.05}>
              <div
                className="rounded-2xl p-8 flex flex-col h-full"
                style={{
                  background: 'var(--ep-card)',
                  border: '1px solid var(--ep-border)',
                  boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: `color-mix(in srgb, ${action.bg} 15%, transparent)` }}
                >
                  <action.icon size={22} style={{ color: action.bg }} />
                </div>
                <h3
                  className="text-xl font-bold mb-3"
                  style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}
                >
                  {action.title}
                </h3>
                <p className="text-sm leading-relaxed mb-6 flex-1" style={{ color: 'var(--ep-muted)' }}>
                  {action.description}
                </p>
                <Link href={action.href}>
                  <Button
                    className="w-full text-white font-semibold"
                    style={{ background: action.bg, border: 'none' }}
                  >
                    {action.cta}
                  </Button>
                </Link>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
