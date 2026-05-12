import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { updateAnimal } from '@/app/actions/animals'
import { ArrowLeft } from 'lucide-react'
import { AnimalForm } from '../../_components/AnimalForm'

export default async function EditAnimalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const animal = await prisma.animalRecord.findUnique({ where: { id } })
  if (!animal) notFound()

  const action = updateAnimal.bind(null, id)

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/animals" className="flex items-center gap-1.5 text-sm hover:opacity-70" style={{ color: 'var(--ep-muted)' }}>
          <ArrowLeft size={15} /> Back
        </Link>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}>
          Edit: {animal.name}
        </h1>
      </div>
      <AnimalForm action={action} defaultValues={animal} />
    </div>
  )
}
