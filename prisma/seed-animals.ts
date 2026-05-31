import { PrismaClient } from '@prisma/client'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const prisma = new PrismaClient()

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')
}

function splitCsv(val: string): string[] {
  return val.split(',').map((s) => s.trim()).filter(Boolean)
}

async function main() {
  const filePath = join(__dirname, 'animals.json')
  const raw = readFileSync(filePath, 'utf-8')
  const animals = JSON.parse(raw) as Record<string, unknown>[]

  console.log(`\n🐾 Seeding ${animals.length} animal(s)...\n`)

  let created = 0
  let skipped = 0
  let updated = 0

  for (const a of animals) {
    const name = a.name as string
    const slug = (a.slug as string) || toSlug(name)

    // Build adoption tiers
    const rawTiers = (a.adoptionTiers as Array<{
      label: string; amount: number; description: string; perks: string[]
    }>) ?? []
    const adoptionTiers = rawTiers.map((t, i) => ({
      id: `${slug}-tier-${i + 1}`,
      animalSlug: slug,
      label: t.label,
      amount: t.amount,
      interval: 'month',
      description: t.description ?? '',
      perks: Array.isArray(t.perks) ? t.perks : splitCsv(t.perks as unknown as string),
    }))

    const data = {
      slug,
      name,
      species: (a.species as string) ?? '',
      commonName: (a.commonName as string) ?? name,
      region: (a.region as string) ?? 'East Africa',
      countries: splitCsv((a.countries as string) ?? ''),
      habitat: splitCsv((a.habitat as string) ?? ''),
      conservationStatus: (a.conservationStatus as string) ?? 'Least Concern',
      populationCurrent: a.populationCurrent != null ? Number(a.populationCurrent) : null,
      populationTrend: (a.populationTrend as string) ?? 'Stable',
      populationYear: Number(a.populationYear ?? 2024),
      imageUrl: (a.imageUrl as string) ?? '',
      thumbnailUrl: (a.thumbnailUrl as string) ?? (a.imageUrl as string) ?? '',
      description: (a.description as string) ?? '',
      extendedDescription: (a.extendedDescription as string) ?? null,
      facts: (a.facts as object) ?? [],
      threats: undefined,
      ecoFacts: undefined,
      adoptionTiers,
      fundingGoal: Number(a.fundingGoal ?? 30000),
      fundingRaised: Number(a.fundingRaised ?? 0),
      published: a.published !== false,
    }

    const existing = await prisma.animalRecord.findUnique({ where: { slug } })

    if (existing) {
      // Update if --update flag passed
      if (process.argv.includes('--update')) {
        await prisma.animalRecord.update({ where: { slug }, data })
        console.log(`  ✏️  Updated: ${name} (${slug})`)
        updated++
      } else {
        console.log(`  ⏭️  Skipped (already exists): ${name} — use --update to overwrite`)
        skipped++
      }
    } else {
      await prisma.animalRecord.create({ data })
      console.log(`  ✅ Created: ${name} (${slug})`)
      created++
    }
  }

  console.log(`\n Done! Created: ${created} | Updated: ${updated} | Skipped: ${skipped}\n`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
