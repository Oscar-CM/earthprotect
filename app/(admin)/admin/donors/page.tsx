import { Badge } from '@/components/ui/badge'
import { Heart, Mail } from 'lucide-react'

type Donor = {
  id: string; name: string; email: string; amount: number; frequency: string; createdAt: Date
}

export default async function DonorsPage() {
  let donors: Donor[] = []
  try {
    const { prisma } = await import('@/lib/prisma')
    donors = await prisma.donor.findMany({ orderBy: { createdAt: 'desc' } }) as Donor[]
  } catch {
    // DB not connected
  }

  const total = donors.reduce((sum, d) => sum + d.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}
          >
            Donors
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--ep-muted)' }}>
            {donors.length} donor{donors.length !== 1 ? 's' : ''} · ${total.toLocaleString()} total raised
          </p>
        </div>
      </div>

      {donors.length === 0 ? (
        <div
          className="p-12 rounded-xl text-center"
          style={{ background: 'var(--ep-card)', border: '1px solid var(--ep-border)' }}
        >
          <Heart size={36} className="mx-auto mb-3" style={{ color: 'var(--ep-muted)' }} />
          <p className="font-semibold" style={{ color: 'var(--ep-text)' }}>No donors yet</p>
          <p className="text-sm mt-1" style={{ color: 'var(--ep-muted)' }}>
            Donors will appear here after their first payment is processed.
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
                {['Name', 'Email', 'Amount', 'Frequency', 'Date'].map((h) => (
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
              {donors.map((d) => (
                <tr
                  key={d.id}
                  style={{ background: 'var(--ep-card)', borderBottom: '1px solid var(--ep-border)' }}
                >
                  <td className="px-4 py-3 font-medium" style={{ color: 'var(--ep-text)' }}>
                    {d.name}
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={`mailto:${d.email}`}
                      className="flex items-center gap-1.5 hover:opacity-70 transition-opacity"
                      style={{ color: 'var(--ep-primary)' }}
                    >
                      <Mail size={13} />
                      {d.email}
                    </a>
                  </td>
                  <td className="px-4 py-3 font-bold" style={{ color: 'var(--ep-primary)' }}>
                    ${d.amount}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary" className="capitalize text-xs">
                      {d.frequency}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--ep-muted)' }}>
                    {new Date(d.createdAt).toLocaleDateString('en-US', {
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
