export const dynamic = 'force-dynamic'

import { Badge } from '@/components/ui/badge'
import { PawPrint, Mail } from 'lucide-react'
import Link from 'next/link'

type Adoption = {
  id: string; donorName: string; donorEmail: string; animalSlug: string
  animalName: string; tierLabel: string; amount: number; interval: string
  active: boolean; createdAt: Date
}

export default async function AdoptersPage() {
  let adoptions: Adoption[] = []
  try {
    const { prisma } = await import('@/lib/prisma')
    adoptions = await prisma.adoption.findMany({ orderBy: { createdAt: 'desc' } }) as Adoption[]
  } catch {
    // DB not connected
  }

  const active = adoptions.filter((a) => a.active).length

  return (
    <div className="space-y-6">
      <div>
        <h1
          className="text-2xl font-bold"
          style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}
        >
          Adopters
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--ep-muted)' }}>
          {adoptions.length} total · {active} active subscriptions
        </p>
      </div>

      {adoptions.length === 0 ? (
        <div
          className="p-12 rounded-xl text-center"
          style={{ background: 'var(--ep-card)', border: '1px solid var(--ep-border)' }}
        >
          <PawPrint size={36} className="mx-auto mb-3" style={{ color: 'var(--ep-muted)' }} />
          <p className="font-semibold" style={{ color: 'var(--ep-text)' }}>No adoptions yet</p>
          <p className="text-sm mt-1" style={{ color: 'var(--ep-muted)' }}>
            Animal adoptions will appear here after checkout.
          </p>
        </div>
      ) : (
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: '1px solid var(--ep-border)' }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--ep-bg2)', borderBottom: '1px solid var(--ep-border)' }}>
                {['Adopter', 'Email', 'Animal', 'Plan', 'Amount', 'Status', 'Date'].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 font-semibold"
                    style={{ color: 'var(--ep-muted)' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {adoptions.map((a) => (
                <tr
                  key={a.id}
                  style={{ background: 'var(--ep-card)', borderBottom: '1px solid var(--ep-border)' }}
                >
                  <td className="px-4 py-3 font-medium" style={{ color: 'var(--ep-text)' }}>
                    {a.donorName}
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={`mailto:${a.donorEmail}`}
                      className="flex items-center gap-1.5 hover:opacity-70 transition-opacity"
                      style={{ color: 'var(--ep-primary)' }}
                    >
                      <Mail size={13} />
                      {a.donorEmail}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/animals/${a.animalSlug}`}
                      className="font-medium hover:underline"
                      style={{ color: 'var(--ep-text)' }}
                    >
                      {a.animalName}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--ep-muted)' }}>
                    {a.tierLabel}
                  </td>
                  <td className="px-4 py-3 font-bold" style={{ color: 'var(--ep-primary)' }}>
                    ${a.amount}/{a.interval}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={a.active ? 'default' : 'secondary'}
                      className="text-xs"
                      style={
                        a.active
                          ? { background: '#dcfce7', color: '#166534' }
                          : {}
                      }
                    >
                      {a.active ? 'Active' : 'Cancelled'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--ep-muted)' }}>
                    {new Date(a.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
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
