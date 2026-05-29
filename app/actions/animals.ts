'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user) redirect('/admin/login')
}

function parseJson<T>(str: string, fallback: T): T {
  try { return JSON.parse(str) } catch { return fallback }
}

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')
}

export async function createAnimal(formData: FormData) {
  await requireAdmin()
  const { prisma } = await import('@/lib/prisma')

  const name = formData.get('name') as string
  const slug = formData.get('slug') as string || toSlug(name)

  // Parse comma-separated strings
  const countries = (formData.get('countries') as string).split(',').map(s => s.trim()).filter(Boolean)
  const habitat = (formData.get('habitat') as string).split(',').map(s => s.trim()).filter(Boolean)

  // Build facts array from numbered fields
  const facts = []
  for (let i = 1; i <= 6; i++) {
    const label = formData.get(`fact_label_${i}`) as string
    const value = formData.get(`fact_value_${i}`) as string
    if (label && value) facts.push({ label, value })
  }

  // Build adoption tiers
  const adoptionTiers = []
  for (let i = 1; i <= 2; i++) {
    const tierLabel = formData.get(`tier_label_${i}`) as string
    const tierAmount = formData.get(`tier_amount_${i}`) as string
    const tierDesc = formData.get(`tier_desc_${i}`) as string
    const tierPerks = (formData.get(`tier_perks_${i}`) as string || '')
      .split(',').map(s => s.trim()).filter(Boolean)
    if (tierLabel && tierAmount) {
      adoptionTiers.push({
        id: `${slug}-tier-${i}`,
        animalSlug: slug,
        label: tierLabel,
        amount: Number(tierAmount),
        interval: 'month',
        description: tierDesc || '',
        perks: tierPerks,
      })
    }
  }

  const imageUrl = formData.get('imageUrl') as string
  const thumbnailUrlRaw = formData.get('thumbnailUrl') as string
  const thumbnailUrl = thumbnailUrlRaw?.trim() || imageUrl.replace('w=1200', 'w=400')

  await prisma.animalRecord.create({
    data: {
      slug,
      name,
      species: formData.get('species') as string,
      commonName: formData.get('commonName') as string || name,
      region: formData.get('region') as string,
      countries,
      conservationStatus: formData.get('conservationStatus') as string,
      populationCurrent: formData.get('populationCurrent') ? Number(formData.get('populationCurrent')) : null,
      populationTrend: (formData.get('populationTrend') as string) || 'Stable',
      populationYear: Number(formData.get('populationYear')) || 2024,
      habitat,
      description: formData.get('description') as string,
      extendedDescription: (formData.get('extendedDescription') as string) || null,
      imageUrl,
      thumbnailUrl,
      facts,
      threats: undefined,
      ecoFacts: undefined,
      adoptionTiers,
      fundingGoal: Number(formData.get('fundingGoal')) || 30000,
      fundingRaised: 0,
      published: formData.get('published') === 'on',
    },
  })

  revalidatePath('/animals')
  revalidatePath('/admin/animals')
  redirect('/admin/animals')
}

export async function updateAnimal(id: string, formData: FormData) {
  await requireAdmin()
  const { prisma } = await import('@/lib/prisma')

  const name = formData.get('name') as string
  const countries = (formData.get('countries') as string).split(',').map(s => s.trim()).filter(Boolean)
  const habitat = (formData.get('habitat') as string).split(',').map(s => s.trim()).filter(Boolean)

  const facts = []
  for (let i = 1; i <= 6; i++) {
    const label = formData.get(`fact_label_${i}`) as string
    const value = formData.get(`fact_value_${i}`) as string
    if (label && value) facts.push({ label, value })
  }

  const adoptionTiers = []
  const rec = await prisma.animalRecord.findUnique({ where: { id } })
  const slug = rec?.slug ?? toSlug(name)

  for (let i = 1; i <= 2; i++) {
    const tierLabel = formData.get(`tier_label_${i}`) as string
    const tierAmount = formData.get(`tier_amount_${i}`) as string
    const tierDesc = formData.get(`tier_desc_${i}`) as string
    const tierPerks = (formData.get(`tier_perks_${i}`) as string || '')
      .split(',').map(s => s.trim()).filter(Boolean)
    if (tierLabel && tierAmount) {
      adoptionTiers.push({
        id: `${slug}-tier-${i}`,
        animalSlug: slug,
        label: tierLabel,
        amount: Number(tierAmount),
        interval: 'month',
        description: tierDesc || '',
        perks: tierPerks,
      })
    }
  }

  const imageUrl = formData.get('imageUrl') as string
  const thumbnailUrlRaw = formData.get('thumbnailUrl') as string
  const thumbnailUrl = thumbnailUrlRaw?.trim() || imageUrl.replace('w=1200', 'w=400')

  await prisma.animalRecord.update({
    where: { id },
    data: {
      name,
      species: formData.get('species') as string,
      commonName: (formData.get('commonName') as string) || name,
      region: formData.get('region') as string,
      countries,
      conservationStatus: formData.get('conservationStatus') as string,
      populationCurrent: formData.get('populationCurrent') ? Number(formData.get('populationCurrent')) : null,
      populationTrend: (formData.get('populationTrend') as string) || 'Stable',
      populationYear: Number(formData.get('populationYear')) || 2024,
      habitat,
      description: formData.get('description') as string,
      extendedDescription: (formData.get('extendedDescription') as string) || null,
      imageUrl,
      thumbnailUrl,
      facts,
      adoptionTiers,
      fundingGoal: Number(formData.get('fundingGoal')) || 30000,
      published: formData.get('published') === 'on',
    },
  })

  revalidatePath('/animals')
  revalidatePath('/admin/animals')
  redirect('/admin/animals')
}

export async function deleteAnimal(id: string) {
  await requireAdmin()
  const { prisma } = await import('@/lib/prisma')
  await prisma.animalRecord.delete({ where: { id } })
  revalidatePath('/animals')
  revalidatePath('/admin/animals')
}
