import Link from 'next/link'
import { Shield, TreePine, Globe, Users, Heart, Award } from 'lucide-react'
import { SectionTitle } from '@/components/shared/SectionTitle'
import { ScrollReveal } from '@/components/shared/ScrollReveal'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'About Us',
  description: 'Learn about Earth Protect\'s mission, team, and impact across Africa.',
}

const TEAM = [
  { name: 'Dr. Amara Osei', role: 'Co-Founder & Director', country: 'Ghana', bio: 'Wildlife biologist with 20 years field experience across East and West Africa.' },
  { name: 'Sarah Kimani', role: 'Head of Conservation', country: 'Kenya', bio: 'Former Kenya Wildlife Service ranger, specialist in large mammal conservation and community engagement.' },
  { name: 'Jean-Paul Habimana', role: 'Gorilla Programme Lead', country: 'Rwanda', bio: 'PhD in primatology, has worked with mountain gorillas in the Virunga landscape for 15 years.' },
  { name: 'Fatima Al-Hassan', role: 'Community Partnerships', country: 'Nigeria', bio: 'Grassroots organizer building conservation capacity across West African communities.' },
  { name: 'Dr. Lena Müller', role: 'Research Director', country: 'Germany', bio: 'Conservation biologist specializing in predator-prey dynamics and GPS telemetry studies.' },
  { name: 'Emmanuel Diallo', role: 'Anti-Trafficking Lead', country: 'Senegal', bio: 'Former INTERPOL wildlife crime analyst, now leading Earth Protect\'s anti-trafficking operations.' },
]

const TIMELINE = [
  { year: '2012', event: 'Earth Protect founded by a group of African conservationists in Nairobi.' },
  { year: '2015', event: 'First major anti-poaching partnership with Kenya Wildlife Service.' },
  { year: '2017', event: 'Launched community ranger training program across 8 countries.' },
  { year: '2019', event: 'Adoption program launched — 5,000 animals sponsored in year one.' },
  { year: '2021', event: 'Expanded to all 5 African regions; online community reaches 10,000 members.' },
  { year: '2024', event: 'Over 1,200 animals under active protection, 850,000 hectares conserved.' },
]

const IMPACT = [
  { icon: Shield, value: '1,200+', label: 'Animals Protected' },
  { icon: TreePine, value: '850K ha', label: 'Habitat Conserved' },
  { icon: Globe, value: '42', label: 'Partner Nations' },
  { icon: Users, value: '18K+', label: 'Community Members' },
  { icon: Heart, value: '12K+', label: 'Animal Adoptions' },
  { icon: Award, value: '95%', label: 'Funds to Field Work' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24" style={{ background: 'var(--ep-bg)' }}>
      {/* Hero */}
      <div
        className="relative py-20 px-6 text-center overflow-hidden"
        style={{ background: 'var(--ep-bg2)', borderBottom: '1px solid var(--ep-border)' }}
      >
        <div className="max-w-3xl mx-auto">
          <SectionTitle
            accent="About Earth Protect"
            title="We Exist Because Africa's Wildlife Cannot Wait"
            subtitle="Founded in 2012 by African conservationists, scientists, and community leaders, Earth Protect works at the intersection of science, community, and compassion to protect the continent's extraordinary biodiversity."
            centered
          />
          <div className="flex justify-center gap-4 mt-6">
            <Link href="/donate">
              <Button className="text-white font-semibold gap-2" style={{ background: 'var(--ep-primary)', border: 'none' }}>
                <Heart size={16} /> Support Our Work
              </Button>
            </Link>
            <Link href="/join">
              <Button variant="outline" className="gap-2 font-semibold" style={{ borderColor: 'var(--ep-border)', color: 'var(--ep-text)' }}>
                <Users size={16} /> Join the Team
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Impact stats */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {IMPACT.map((stat) => (
              <div
                key={stat.label}
                className="text-center p-5 rounded-xl"
                style={{ background: 'var(--ep-card)', border: '1px solid var(--ep-border)' }}
              >
                <stat.icon size={22} className="mx-auto mb-2" style={{ color: 'var(--ep-primary)' }} />
                <p className="text-xl font-bold" style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}>
                  {stat.value}
                </p>
                <p className="text-xs" style={{ color: 'var(--ep-muted)' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>

      {/* Our story / timeline */}
      <div
        className="py-16 px-6"
        style={{ background: 'var(--ep-bg2)', borderTop: '1px solid var(--ep-border)', borderBottom: '1px solid var(--ep-border)' }}
      >
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <SectionTitle
              accent="Our Story"
              title="A Decade of Conservation"
              centered
            />
          </ScrollReveal>
          <div className="relative">
            <div
              className="absolute left-4 top-0 bottom-0 w-0.5"
              style={{ background: 'var(--ep-border)' }}
            />
            <div className="space-y-6 pl-12">
              {TIMELINE.map((item) => (
                <ScrollReveal key={item.year}>
                  <div className="relative">
                    <div
                      className="absolute -left-[34px] w-4 h-4 rounded-full border-2"
                      style={{ background: 'var(--ep-primary)', borderColor: 'var(--ep-bg2)', top: '4px' }}
                    />
                    <span className="text-xs font-bold uppercase tracking-wider block mb-1" style={{ color: 'var(--ep-primary)' }}>
                      {item.year}
                    </span>
                    <p className="text-sm" style={{ color: 'var(--ep-muted)' }}>{item.event}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <ScrollReveal>
          <SectionTitle
            accent="Our Team"
            title="The People Behind Earth Protect"
            subtitle="Our team spans 12 African nations and brings together conservation scientists, community leaders, rangers, and advocates."
            centered
          />
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEAM.map((member, i) => (
            <ScrollReveal key={member.name} threshold={0.1 + i * 0.03}>
              <div
                className="p-5 rounded-xl"
                style={{ background: 'var(--ep-card)', border: '1px solid var(--ep-border)' }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-3 text-lg font-bold"
                  style={{ background: 'color-mix(in srgb, var(--ep-primary) 15%, transparent)', color: 'var(--ep-primary)' }}
                >
                  {member.name.charAt(0)}
                </div>
                <p className="font-bold text-base mb-0.5" style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}>
                  {member.name}
                </p>
                <p className="text-xs font-semibold mb-0.5" style={{ color: 'var(--ep-primary)' }}>{member.role}</p>
                <p className="text-xs mb-2" style={{ color: 'var(--ep-accent)' }}>📍 {member.country}</p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--ep-muted)' }}>{member.bio}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Transparency / CTA */}
      <div
        className="py-16 px-6 text-center"
        style={{ background: 'var(--ep-secondary)' }}
      >
        <div className="max-w-2xl mx-auto">
          <p className="text-white/70 text-sm uppercase tracking-widest mb-2 font-semibold">Transparency</p>
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-lora)' }}>
            We Answer to Africa, Not Shareholders
          </h2>
          <p className="text-white/70 mb-8 leading-relaxed">
            95% of all donations go directly to field conservation work.
            We publish annual reports detailing every dollar spent.
            Our board is composed entirely of African conservationists.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/donate">
              <Button className="text-white font-semibold gap-2 bg-white/20 hover:bg-white/30 border-white/30 border">
                <Heart size={16} /> Donate Now
              </Button>
            </Link>
            <Link href="/animals">
              <Button variant="outline" className="text-white border-white/40 hover:bg-white/10 font-semibold">
                Meet the Animals
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
