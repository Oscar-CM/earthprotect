export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { createAnimal } from '@/app/actions/animals'
import { ArrowLeft } from 'lucide-react'
import { AnimalForm } from '../_components/AnimalForm'

export default function NewAnimalPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/animals" className="flex items-center gap-1.5 text-sm hover:opacity-70" style={{ color: 'var(--ep-muted)' }}>
          <ArrowLeft size={15} /> Back
        </Link>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}>
          Add Animal
        </h1>
      </div>
      <AnimalForm action={createAnimal} />
    </div>
  )
}
