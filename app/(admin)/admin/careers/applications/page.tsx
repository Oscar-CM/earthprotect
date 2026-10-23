export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { APPLICATION_STAGES, getStage } from '@/lib/careers'
import { PageHeading } from '../_components/fields'

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ stage?: string; opening?: string; country?: string }>
}) {
  const { stage, opening, country } = await searchParams

  const [applications, openings, countries, stageCounts] = await Promise.all([
    prisma.joinApplication.findMany({
      where: {
        role: { startsWith: 'job:' },
        ...(stage ? { stage } : {}),
        ...(opening ? { openingId: opening } : {}),
        ...(country ? { country } : {}),
      },
      orderBy: { createdAt: 'desc' },
      include: { opening: { include: { role: true } } },
    }),
    prisma.careerOpening.findMany({ include: { country: true, role: true }, orderBy: { country: { name: 'asc' } } }),
    prisma.careerCountry.findMany({ orderBy: { name: 'asc' } }),
    prisma.joinApplication.groupBy({ by: ['stage'], where: { role: { startsWith: 'job:' } }, _count: true }),
  ])

  const total = stageCounts.reduce((n, g) => n + g._count, 0)
  const href = (params: Record<string, string | undefined>) => {
    const q = new URLSearchParams()
    for (const [k, v] of Object.entries({ stage, opening, country, ...params })) if (v) q.set(k, v)
    const qs = q.toString()
    return `/admin/careers/applications${qs ? `?${qs}` : ''}`
  }

  const chip = (active: boolean) => ({
    background: active ? 'var(--ep-primary)' : 'var(--ep-card)',
    color: active ? 'white' : 'var(--ep-text)',
    border: `1px solid ${active ? 'var(--ep-primary)' : 'var(--ep-border)'}`,
  })

  return (
    <div className="space-y-6">
      <PageHeading title="Career applications" subtitle={`${total} total · ${applications.length} shown`} />
      <Link href="/admin/careers" className="text-sm underline" style={{ color: 'var(--ep-primary)' }}>← Back to careers</Link>

      <div className="flex flex-wrap gap-2">
        <Link href={href({ stage: '' })} className="px-3 py-1.5 rounded-full text-xs font-medium" style={chip(!stage)}>All stages</Link>
        {APPLICATION_STAGES.map((s) => (
          <Link key={s.id} href={href({ stage: s.id })} className="px-3 py-1.5 rounded-full text-xs font-medium" style={chip(stage === s.id)}>
            {s.label} ({stageCounts.find((g) => g.stage === s.id)?._count ?? 0})
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        <Link href={href({ country: '' })} className="px-3 py-1.5 rounded-full font-medium" style={chip(!country)}>All countries</Link>
        {countries.map((c) => (
          <Link key={c.id} href={href({ country: c.name })} className="px-3 py-1.5 rounded-full font-medium" style={chip(country === c.name)}>
            {c.flag} {c.name}
          </Link>
        ))}
        {opening && (
          <Link href={href({ opening: '' })} className="px-3 py-1.5 rounded-full font-medium" style={chip(true)}>
            {(() => { const o = openings.find((x) => x.id === opening); return o ? `${o.role.title} · ${o.country.name}` : 'One opening' })()} ✕
          </Link>
        )}
      </div>

      {applications.length === 0 ? (
        <div className="p-12 rounded-xl text-center" style={{ background: 'var(--ep-card)', border: '1px solid var(--ep-border)' }}>
          <p className="font-semibold" style={{ color: 'var(--ep-text)' }}>No applications match</p>
        </div>
      ) : (
        <div className="rounded-xl overflow-x-auto" style={{ border: '1px solid var(--ep-border)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--ep-bg2)', borderBottom: '1px solid var(--ep-border)', color: 'var(--ep-muted)' }}>
                {['Applicant', 'Position', 'Applied', 'Stage'].map((h) => <th key={h} className="text-left px-4 py-3 font-semibold">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {applications.map((a) => {
                const st = getStage(a.stage)
                return (
                  <tr key={a.id} style={{ background: 'var(--ep-card)', borderBottom: '1px solid var(--ep-border)' }}>
                    <td className="px-4 py-3">
                      <Link href={`/admin/careers/applications/${a.id}`} className="font-medium hover:underline" style={{ color: 'var(--ep-text)' }}>
                        {a.firstName} {a.lastName}
                      </Link>
                      <p className="text-xs" style={{ color: 'var(--ep-muted)' }}>{a.email}</p>
                    </td>
                    <td className="px-4 py-3" style={{ color: 'var(--ep-muted)' }}>
                      {a.opening ? `${a.opening.role.title} · ${a.country}` : `${a.role} · ${a.country}`}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs" style={{ color: 'var(--ep-muted)' }}>
                      {a.createdAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: st.bg, color: st.color }}>{st.label}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
