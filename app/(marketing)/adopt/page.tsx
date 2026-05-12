import { Suspense } from 'react'
import { AdoptClient } from './AdoptClient'

export const metadata = {
  title: 'Adopt an Animal',
  description: 'Sponsor an African wildlife species with a monthly or annual adoption. Receive a digital certificate and regular updates.',
}

export default function AdoptPage() {
  return (
    <Suspense fallback={null}>
      <AdoptClient />
    </Suspense>
  )
}
