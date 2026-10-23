import { ANIMALS } from '@/lib/constants'
import type { Animal } from '@/types'

// Published DB animals take priority over static ones with the same slug.
export async function getAllAnimals(): Promise<Animal[]> {
  let db: Animal[] = []
  try {
    const { prisma } = await import('@/lib/prisma')
    const records = await prisma.animalRecord.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    })
    db = records.map((r: typeof records[number]) => ({
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
      adoptionTiers: (r.adoptionTiers as unknown as Animal['adoptionTiers']) ?? [],
      fundingGoal: r.fundingGoal,
      fundingRaised: r.fundingRaised,
    }))
  } catch {
    /* fall back to static data */
  }
  const dbSlugs = new Set(db.map((a) => a.slug))
  return [...db, ...ANIMALS.filter((a) => !dbSlugs.has(a.slug))]
}

export async function getAnimalBySlug(slug: string): Promise<Animal | null> {
  return (await getAllAnimals()).find((a) => a.slug === slug) ?? null
}
