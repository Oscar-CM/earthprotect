export const dynamic = 'force-dynamic'

import { Heart, PawPrint, FileText, ShoppingBag, TrendingUp } from 'lucide-react'

type RecentDonor = { id: string; name: string; email: string; amount: number; frequency: string }
type RecentAdoption = { id: string; donorName: string; animalName: string; tierLabel: string; amount: number; interval: string }

async function getStats() {
  try {
    const { prisma } = await import('@/lib/prisma')
    const [donors, adoptions, orders, posts] = await Promise.all([
      prisma.donor.count(),
      prisma.adoption.count({ where: { active: true } }),
      prisma.order.count(),
      prisma.blogPost.count({ where: { published: true } }),
    ])
    const [recentDonors, recentAdoptions] = await Promise.all([
      prisma.donor.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
      prisma.adoption.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    ])
    return { donors, adoptions, orders, posts, recentDonors: recentDonors as RecentDonor[], recentAdoptions: recentAdoptions as RecentAdoption[] }
  } catch {
    return { donors: 0, adoptions: 0, orders: 0, posts: 0, recentDonors: [] as RecentDonor[], recentAdoptions: [] as RecentAdoption[] }
  }
}

export default async function AdminDashboard() {
  const { donors, adoptions, orders, posts, recentDonors, recentAdoptions } = await getStats()

  const cards = [
    { label: 'Total Donors', value: donors, icon: Heart, color: '#dc2626' },
    { label: 'Active Adoptions', value: adoptions, icon: PawPrint, color: '#059669' },
    { label: 'Shop Orders', value: orders, icon: ShoppingBag, color: '#7c3aed' },
    { label: 'Published Posts', value: posts, icon: FileText, color: '#0284c7' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1
          className="text-2xl font-bold"
          style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}
        >
          Dashboard
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--ep-muted)' }}>
          Overview of Earth Protect activity
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="p-5 rounded-xl"
            style={{ background: 'var(--ep-card)', border: '1px solid var(--ep-border)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--ep-muted)' }}>
                {card.label}
              </p>
              <card.icon size={16} style={{ color: card.color }} />
            </div>
            <p className="text-3xl font-bold" style={{ color: 'var(--ep-text)' }}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent donors */}
        <div
          className="p-5 rounded-xl"
          style={{ background: 'var(--ep-card)', border: '1px solid var(--ep-border)' }}
        >
          <h2
            className="font-semibold mb-4 flex items-center gap-2"
            style={{ color: 'var(--ep-text)' }}
          >
            <TrendingUp size={16} style={{ color: 'var(--ep-primary)' }} />
            Recent Donors
          </h2>
          {recentDonors.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--ep-muted)' }}>No donors yet.</p>
          ) : (
            <ul className="space-y-3">
              {recentDonors.map((d) => (
                <li key={d.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--ep-text)' }}>{d.name}</p>
                    <p className="text-xs" style={{ color: 'var(--ep-muted)' }}>{d.email}</p>
                  </div>
                  <span
                    className="text-sm font-bold"
                    style={{ color: 'var(--ep-primary)' }}
                  >
                    ${d.amount}/{d.frequency}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent adoptions */}
        <div
          className="p-5 rounded-xl"
          style={{ background: 'var(--ep-card)', border: '1px solid var(--ep-border)' }}
        >
          <h2
            className="font-semibold mb-4 flex items-center gap-2"
            style={{ color: 'var(--ep-text)' }}
          >
            <PawPrint size={16} style={{ color: 'var(--ep-primary)' }} />
            Recent Adoptions
          </h2>
          {recentAdoptions.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--ep-muted)' }}>No adoptions yet.</p>
          ) : (
            <ul className="space-y-3">
              {recentAdoptions.map((a) => (
                <li key={a.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--ep-text)' }}>{a.donorName}</p>
                    <p className="text-xs" style={{ color: 'var(--ep-muted)' }}>{a.animalName} · {a.tierLabel}</p>
                  </div>
                  <span
                    className="text-sm font-bold"
                    style={{ color: 'var(--ep-primary)' }}
                  >
                    ${a.amount}/{a.interval}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
