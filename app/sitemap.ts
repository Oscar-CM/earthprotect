import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://earthprotect.org'
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/animals`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/adopt`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/donate`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/shop`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/regions`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ]
}
