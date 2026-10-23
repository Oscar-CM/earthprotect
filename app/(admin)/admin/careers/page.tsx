export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { Plus, Pencil, Trash2, Users, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'
import {
  deleteCareerCountry, deleteCareerOpening, deleteCareerRole,
  importCareerDefaults, setCareerOpeningStatus,
} from '@/app/actions/careers-admin'
import { openingAvailability } from '@/lib/careers'
import { ConfirmButton } from './_components/ConfirmButton'

const card = { background: 'var(--ep-card)', border: '1px solid var(--ep-border)' }
const th = 'text-left px-4 py-3 font-semibold'
const AVAIL: Record<string, { label: string; bg: string; color: string }> = {
  open: { label: 'Open', bg: '#dcfce7', color: '#166534' },
  upcoming: { label: 'Opens soon', bg: '#dbeafe', color: '#1e40af' },
  closed: { label: 'Closed', bg: '#f3f4f6', color: '#374151' },
}

function fmt(d: Date | null) {
  return d ? d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'
}

function SectionHead({ title, addHref, addLabel }: { title: string; addHref: string; addLabel: string }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}>{title}</h2>
      <Link href={addHref}>
        <Button size="sm" className="flex items-center gap-1.5 text-white" style={{ background: 'var(--ep-primary)', border: 'none' }}>
          <Plus size={14} /> {addLabel}
        </Button>
      </Link>
    </div>
  )
}

export default async function AdminCareersPage() {
  const [countries, roles, openings, appCounts] = await Promise.all([
    prisma.careerCountry.findMany({ orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }], include: { _count: { select: { openings: true } } } }),
    prisma.careerRole.findMany({ orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }], include: { _count: { select: { openings: true } } } }),
    prisma.careerOpening.findMany({
      include: { country: true, role: true, _count: { select: { applications: true } } },
      orderBy: [{ country: { sortOrder: 'asc' } }, { role: { sortOrder: 'asc' } }],
    }),
    prisma.joinApplication.groupBy({ by: ['stage'], where: { openingId: { not: null } }, _count: true }),
  ])
  const totalApps = appCounts.reduce((n, g) => n + g._count, 0)
  const newApps = appCounts.find((g) => g.stage === 'applied')?._count ?? 0
  const empty = countries.length === 0 && roles.length === 0

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}>Careers</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--ep-muted)' }}>
            {countries.length} countries · {roles.length} roles · {openings.length} openings
          </p>
        </div>
        <Link href="/admin/careers/applications">
          <Button variant="outline" className="flex items-center gap-1.5">
            <Users size={15} /> Applications ({totalApps}{newApps ? `, ${newApps} new` : ''})
          </Button>
        </Link>
      </div>

      {empty && (
        <div className="p-8 rounded-xl text-center" style={card}>
          <p className="font-semibold" style={{ color: 'var(--ep-text)' }}>Nothing here yet</p>
          <p className="text-sm mt-1 mb-4" style={{ color: 'var(--ep-muted)' }}>
            Import the original Kenya, South Africa, DR Congo and Nigeria listings and the three roles, then edit them freely.
          </p>
          <form action={importCareerDefaults}>
            <Button type="submit" className="inline-flex items-center gap-1.5 text-white" style={{ background: 'var(--ep-primary)', border: 'none' }}>
              <Download size={15} /> Import default careers
            </Button>
          </form>
        </div>
      )}

      {/* Openings */}
      <section className="space-y-3">
        <SectionHead title="Openings" addHref="/admin/careers/openings/new" addLabel="Add opening" />
        <div className="rounded-xl overflow-x-auto" style={{ border: '1px solid var(--ep-border)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--ep-bg2)', borderBottom: '1px solid var(--ep-border)', color: 'var(--ep-muted)' }}>
                {['Role', 'Country', 'Status', 'Window', 'Applications', 'Actions'].map((h) => <th key={h} className={th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {openings.map((o) => {
                const a = o.status === 'draft' ? { label: 'Draft', bg: '#fef9c3', color: '#854d0e' } : AVAIL[openingAvailability(o.status, o.opensAt, o.closesAt)]
                const next = o.status === 'open' ? 'closed' : 'open'
                return (
                  <tr key={o.id} style={{ ...card, borderBottom: '1px solid var(--ep-border)' }}>
                    <td className="px-4 py-3 font-medium" style={{ color: 'var(--ep-text)' }}>{o.role.title}</td>
                    <td className="px-4 py-3" style={{ color: 'var(--ep-text)' }}>{o.country.flag} {o.country.name}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: a.bg, color: a.color }}>{a.label}</span>
                    </td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: 'var(--ep-muted)' }}>{fmt(o.opensAt)} → {fmt(o.closesAt)}</td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/careers/applications?opening=${o.id}`} className="underline text-xs" style={{ color: 'var(--ep-primary)' }}>
                        {o._count.applications}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Link href={`/admin/careers/openings/${o.id}`} className="hover:opacity-70" aria-label="Edit opening"><Pencil size={15} style={{ color: 'var(--ep-primary)' }} /></Link>
                        <form action={setCareerOpeningStatus.bind(null, o.id, next)}>
                          <button type="submit" className="text-xs font-medium hover:opacity-70" style={{ color: 'var(--ep-muted)' }}>
                            {o.status === 'open' ? 'Close' : 'Open'}
                          </button>
                        </form>
                        <form action={deleteCareerOpening.bind(null, o.id)}>
                          <ConfirmButton message={`Delete this opening? Its ${o._count.applications} application(s) are kept but unlinked.`} className="hover:opacity-70">
                            <Trash2 size={15} style={{ color: '#dc2626' }} />
                          </ConfirmButton>
                        </form>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {openings.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-6 text-center text-sm" style={{ color: 'var(--ep-muted)' }}>No openings yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Countries */}
      <section className="space-y-3">
        <SectionHead title="Countries" addHref="/admin/careers/countries/new" addLabel="Add country" />
        <div className="rounded-xl overflow-x-auto" style={{ border: '1px solid var(--ep-border)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--ep-bg2)', borderBottom: '1px solid var(--ep-border)', color: 'var(--ep-muted)' }}>
                {['Country', 'Region', 'Openings', 'Visible', 'Actions'].map((h) => <th key={h} className={th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {countries.map((c) => (
                <tr key={c.id} style={{ ...card, borderBottom: '1px solid var(--ep-border)' }}>
                  <td className="px-4 py-3 font-medium" style={{ color: 'var(--ep-text)' }}>{c.flag} {c.name} <span className="text-xs" style={{ color: 'var(--ep-muted)' }}>({c.code})</span></td>
                  <td className="px-4 py-3" style={{ color: 'var(--ep-muted)' }}>{c.region || '—'}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--ep-muted)' }}>{c._count.openings}</td>
                  <td className="px-4 py-3" style={{ color: c.published ? '#059669' : 'var(--ep-muted)' }}>{c.published ? 'Yes' : 'Hidden'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link href={`/admin/careers/countries/${c.id}`} className="hover:opacity-70" aria-label="Edit country"><Pencil size={15} style={{ color: 'var(--ep-primary)' }} /></Link>
                      <form action={deleteCareerCountry.bind(null, c.id)}>
                        <ConfirmButton message={`Delete ${c.name} and its ${c._count.openings} opening(s)? Applications are kept.`} className="hover:opacity-70">
                          <Trash2 size={15} style={{ color: '#dc2626' }} />
                        </ConfirmButton>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {countries.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-sm" style={{ color: 'var(--ep-muted)' }}>No countries yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Roles */}
      <section className="space-y-3">
        <SectionHead title="Roles (job descriptions)" addHref="/admin/careers/roles/new" addLabel="Add role" />
        <div className="rounded-xl overflow-x-auto" style={{ border: '1px solid var(--ep-border)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--ep-bg2)', borderBottom: '1px solid var(--ep-border)', color: 'var(--ep-muted)' }}>
                {['Title', 'Reports to', 'Openings', 'Visible', 'Actions'].map((h) => <th key={h} className={th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {roles.map((r) => (
                <tr key={r.id} style={{ ...card, borderBottom: '1px solid var(--ep-border)' }}>
                  <td className="px-4 py-3 font-medium" style={{ color: 'var(--ep-text)' }}>{r.title}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--ep-muted)' }}>{r.reportsTo || '—'}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--ep-muted)' }}>{r._count.openings}</td>
                  <td className="px-4 py-3" style={{ color: r.published ? '#059669' : 'var(--ep-muted)' }}>{r.published ? 'Yes' : 'Hidden'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link href={`/admin/careers/roles/${r.id}`} className="hover:opacity-70" aria-label="Edit role"><Pencil size={15} style={{ color: 'var(--ep-primary)' }} /></Link>
                      <form action={deleteCareerRole.bind(null, r.id)}>
                        <ConfirmButton message={`Delete ${r.title} and its ${r._count.openings} opening(s) in every country? Applications are kept.`} className="hover:opacity-70">
                          <Trash2 size={15} style={{ color: '#dc2626' }} />
                        </ConfirmButton>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {roles.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-sm" style={{ color: 'var(--ep-muted)' }}>No roles yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
