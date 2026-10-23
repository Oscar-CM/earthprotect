export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import { AdoptClient } from './AdoptClient'
import { getAllAnimals } from '@/lib/animals'

export const metadata = {
  title: 'Adopt an Animal',
  description: 'Sponsor an African wildlife species with a monthly or annual adoption. Receive a digital certificate and regular updates.',
}

export default async function AdoptPage() {
  const animals = (await getAllAnimals()).filter((a) => a.adoptionTiers.length > 0)
  return (
    <Suspense fallback={null}>
      <AdoptClient animals={animals} />
    </Suspense>
  )
}
