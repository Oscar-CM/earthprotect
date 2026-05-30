import { HeroSection } from '@/components/sections/HeroSection'
import { MissionSection } from '@/components/sections/MissionSection'
import { ImpactStatsSection } from '@/components/sections/ImpactStatsSection'
import { FeaturedAnimalsSection } from '@/components/sections/FeaturedAnimalsSection'
import { CtaSection } from '@/components/sections/CtaSection'

export const metadata = {
  title: 'Earth Protect | Protecting African Wildlife',
  description: 'Adopt an African animal, donate to conservation, or join our global community. Every action protects Africa\'s wildlife for future generations.',
  alternates: { canonical: '/' },
}

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Earth Protect',
  url: process.env.NEXT_PUBLIC_BASE_URL ?? 'https://earthprotect.org',
  potentialAction: {
    '@type': 'SearchAction',
    target: `${process.env.NEXT_PUBLIC_BASE_URL ?? 'https://earthprotect.org'}/animals?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
}

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <HeroSection />
      <MissionSection />
      <ImpactStatsSection />
      <FeaturedAnimalsSection />
      <CtaSection />
    </>
  )
}
