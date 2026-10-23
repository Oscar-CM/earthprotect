export const dynamic = 'force-dynamic'

import { CareersClient } from './CareersClient'
import { getPublicCareers } from '@/lib/careers-data'
import type { PublicCountry } from '@/lib/careers'

export const metadata = {
  title: 'Careers',
  description: 'Join Earth Protect as a Country Supervisor or Coordinator across Africa.',
}

export default async function CareersPage() {
  let countries: PublicCountry[] = []
  try {
    countries = await getPublicCareers()
  } catch (err) {
    console.error('[Careers] Failed to load openings:', err)
  }
  return <CareersClient countries={countries} />
}
