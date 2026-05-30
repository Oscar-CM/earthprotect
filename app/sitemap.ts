import type { MetadataRoute } from 'next'
import { ANIMALS, BLOG_POSTS, SHOP_ITEMS } from '@/lib/constants'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://earthprotect.org'
  const now = new Date()

  // Fetch DB animals and blog posts
  let dbAnimalSlugs: string[] = []
  let dbBlogSlugs: { slug: string; updatedAt: Date }[] = []
  try {
    const { prisma } = await import('@/lib/prisma')
    const [animals, posts] = await Promise.all([
      prisma.animalRecord.findMany({ where: { published: true }, select: { slug: true } }),
      prisma.blogPost.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    ])
    dbAnimalSlugs = animals.map((a) => a.slug)
    dbBlogSlugs = posts
  } catch { /* use static fallback */ }

  // Merge static + DB (DB takes precedence)
  const allAnimalSlugs = [...new Set([...dbAnimalSlugs, ...ANIMALS.map((a) => a.slug)])]
  const staticBlogSlugs = BLOG_POSTS.map((p) => p.slug)
  const dbBlogSlugSet = new Set(dbBlogSlugs.map((p) => p.slug))
  const allBlogEntries = [
    ...dbBlogSlugs.map((p) => ({ slug: p.slug, date: p.updatedAt })),
    ...staticBlogSlugs.filter((s) => !dbBlogSlugSet.has(s)).map((s) => ({ slug: s, date: now })),
  ]

  return [
    // Core pages
    { url: base, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/animals`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/adopt`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/donate`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/shop`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/regions`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/join`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },

    // Animal detail pages
    ...allAnimalSlugs.map((slug) => ({
      url: `${base}/animals/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),

    // Blog posts
    ...allBlogEntries.map(({ slug, date }) => ({
      url: `${base}/blog/${slug}`,
      lastModified: date,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),

    // Shop items
    ...SHOP_ITEMS.map((item) => ({
      url: `${base}/shop/${item.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),
  ]
}
