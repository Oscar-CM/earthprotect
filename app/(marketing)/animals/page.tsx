import { ANIMALS } from '@/lib/constants'
import { AnimalsClient } from './AnimalsClient'
import type { Animal } from '@/types'

export const metadata = {
  title: 'African Wildlife',
  description: "Browse and learn about Africa's iconic wildlife species — filter by region, conservation status, and more.",
}

async function getDbAnimals(): Promise<Animal[]> {
  try {
    const { prisma } = await import('@/lib/prisma')
    const records = await prisma.animalRecord.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    })
    return records.map((r: typeof records[number]) => ({
      slug: r.slug,
      name: r.name,
      species: r.species,
      commonName: r.commonName,
      region: r.region as Animal['region'],
      countries: r.countries,
      conservationStatus: r.conservationStatus as Animal['conservationStatus'],
      population: {
        current: r.populationCurrent,
        trend: r.populationTrend as Animal['population']['trend'],
        year: r.populationYear,
      },
      habitat: r.habitat,
      description: r.description,
      extendedDescription: r.extendedDescription ?? undefined,
      imageUrl: r.imageUrl,
      thumbnailUrl: r.thumbnailUrl,
      facts: r.facts as unknown as Animal['facts'],
      threats: (r.threats as unknown as Animal['threats']) ?? undefined,
      ecoFacts: (r.ecoFacts as unknown as Animal['ecoFacts']) ?? undefined,
      adoptionTiers: r.adoptionTiers as unknown as Animal['adoptionTiers'],
      fundingGoal: r.fundingGoal,
      fundingRaised: r.fundingRaised,
    }))
  } catch {
    return []
  }
}

export default async function AnimalsPage() {
  const dbAnimals = await getDbAnimals()
  // DB animals take priority; filter out any static animals with matching slugs
  const dbSlugs = new Set(dbAnimals.map((a) => a.slug))
  const staticAnimals = ANIMALS.filter((a) => !dbSlugs.has(a.slug))
  const allAnimals = [...dbAnimals, ...staticAnimals]

  return <AnimalsClient animals={allAnimals} />
}
