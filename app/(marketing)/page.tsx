import { HeroSection } from '@/components/sections/HeroSection'
import { MissionSection } from '@/components/sections/MissionSection'
import { ImpactStatsSection } from '@/components/sections/ImpactStatsSection'
import { FeaturedAnimalsSection } from '@/components/sections/FeaturedAnimalsSection'
import { CtaSection } from '@/components/sections/CtaSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MissionSection />
      <ImpactStatsSection />
      <FeaturedAnimalsSection />
      <CtaSection />
    </>
  )
}
