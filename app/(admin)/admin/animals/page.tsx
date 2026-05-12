export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { deleteAnimal } from '@/app/actions/animals'
import { Plus, Pencil, Trash2, ExternalLink } from 'lucide-react'

type AnimalRow = {
  id: string; slug: string; name: string; region: string
  conservationStatus: string; published: boolean; createdAt: Date
}

export default async function AdminAnimalsPage() {
  let animals: AnimalRow[] = []
  try {
    const { prisma } = await import('@/lib/prisma')
    animals = await prisma.animalRecord.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, slug: true, name: true, region: true, conservationStatus: true, published: true, createdAt: true },
    }) as AnimalRow[]
  } catch { /* DB not connected */ }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}>
            Animals
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--ep-muted)' }}>
            {animals.length} DB animal{animals.length !== 1 ? 's' : ''} · static animals are defined in constants.ts
          </p>
        </div>
        <Link href="/admin/animals/new">
          <Button className="flex items-center gap-1.5 text-white" style={{ background: 'var(--ep-primary)', border: 'none' }}>
            <Plus size={16} /> Add Animal
          </Button>
        </Link>
      </div>

      {animals.length === 0 ? (
        <div className="p-12 rounded-xl text-center" style={{ background: 'var(--ep-card)', border: '1px solid var(--ep-border)' }}>
          <p className="text-4xl mb-3">🦁</p>
          <p className="font-semibold" style={{ color: 'var(--ep-text)' }}>No custom animals yet</p>
          <p className="text-sm mt-1 mb-4" style={{ color: 'var(--ep-muted)' }}>
            Add animals here to supplement the built-in catalog.
          </p>
          <Link href="/admin/animals/new">
            <Button className="text-white" style={{ background: 'var(--ep-primary)', border: 'none' }}>
              Add first animal
            </Button>
          </Link>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--ep-border)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--ep-bg2)', borderBottom: '1px solid var(--ep-border)' }}>
                {['Name', 'Region', 'Status', 'Published', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-semibold" style={{ color: 'var(--ep-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {animals.map(a => (
                <tr key={a.id} style={{ background: 'var(--ep-card)', borderBottom: '1px solid var(--ep-border)' }}>
                  <td className="px-4 py-3">
                    <p className="font-medium" style={{ color: 'var(--ep-text)' }}>{a.name}</p>
                    <p className="text-xs" style={{ color: 'var(--ep-muted)' }}>/{a.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--ep-muted)' }}>{a.region}</td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary" className="text-xs">{a.conservationStatus}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium" style={{ color: a.published ? '#059669' : 'var(--ep-muted)' }}>
                      {a.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/animals/${a.slug}`} target="_blank">
                        <button className="p-1.5 rounded hover:opacity-70" style={{ color: 'var(--ep-muted)' }} title="View">
                          <ExternalLink size={13} />
                        </button>
                      </Link>
                      <Link href={`/admin/animals/${a.id}/edit`}>
                        <button className="p-1.5 rounded hover:opacity-70" style={{ color: 'var(--ep-muted)' }} title="Edit">
                          <Pencil size={13} />
                        </button>
                      </Link>
                      <form action={async () => { 'use server'; await deleteAnimal(a.id) }}>
                        <button type="submit" className="p-1.5 rounded hover:opacity-70" style={{ color: '#dc2626' }} title="Delete">
                          <Trash2 size={13} />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
