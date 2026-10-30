export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { CareersClient } from './CareersClient'
import { getPublicCareers } from '@/lib/careers-data'
import type { PublicCountry } from '@/lib/careers'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://masterwriters.org'

type SearchParams = Promise<{ job?: string }>

async function loadCareers(): Promise<PublicCountry[]> {
  try {
    return await getPublicCareers()
  } catch (err) {
    console.error('[Careers] Failed to load openings:', err)
    return []
  }
}

/** Shared links (?job=<id>) get that job's title and summary as the social preview. */
export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const { job } = await searchParams
  const base: Metadata = {
    title: 'Careers',
    description: 'Join Earth Protect as a Country Supervisor or Coordinator across Africa.',
    openGraph: {
      title: 'Careers at Earth Protect',
      description: 'Join Earth Protect as a Country Supervisor or Coordinator across Africa.',
      images: [{ url: `${BASE_URL}/api/og/career`, width: 1200, height: 630 }],
    },
  }
  if (!job) return base

  const countries = await loadCareers()
  for (const c of countries) {
    const o = c.openings.find((x) => x.id === job)
    if (o) {
      const title = `${o.title}, ${c.name} · Earth Protect is hiring`
      const description = o.summary.slice(0, 200)
      const url = `${BASE_URL}/careers?job=${encodeURIComponent(job)}`
      const image = `${BASE_URL}/api/og/career?job=${encodeURIComponent(job)}`
      return {
        title,
        description,
        alternates: { canonical: url },
        openGraph: {
          title,
          description,
          url,
          type: 'website',
          siteName: 'Earth Protect',
          images: [{ url: image, width: 1200, height: 630, alt: title }],
        },
        twitter: { card: 'summary_large_image', title, description, images: [image] },
      }
    }
  }
  return base
}

export default async function CareersPage({ searchParams }: { searchParams: SearchParams }) {
  const { job } = await searchParams
  const countries = await loadCareers()
  return <CareersClient countries={countries} baseUrl={BASE_URL} initialJobId={job ?? null} />
}
