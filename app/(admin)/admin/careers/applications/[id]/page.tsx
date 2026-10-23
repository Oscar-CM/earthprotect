export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'
import { addApplicationNote, changeApplicationStage } from '@/app/actions/careers-admin'
import { APPLICATION_STAGES, getStage } from '@/lib/careers'
import { Area, SelectField, Section } from '../../_components/fields'

const fmt = (d: Date) =>
  d.toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const app = await prisma.joinApplication.findUnique({
    where: { id },
    include: { events: { orderBy: { createdAt: 'desc' } }, opening: { include: { role: true, country: true } } },
  })
  if (!app) notFound()

  const stage = getStage(app.stage)
  const details: [string, string | null][] = [
    ['Email', app.email],
    ['Phone / WhatsApp', app.phone],
    ['Lives in', app.residence],
    ['Years of experience', app.yearsExperience],
    ['Right to work', app.opening ? (app.rightToWork ? 'Declared yes' : 'Not declared') : null],
    ['Background checks consent', app.opening ? (app.backgroundConsent ? 'Consented' : 'Not given') : null],
  ]

  return (
    <div className="space-y-6 max-w-3xl">
      <Link href="/admin/careers/applications" className="text-sm underline" style={{ color: 'var(--ep-primary)' }}>← All applications</Link>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}>
            {app.firstName} {app.lastName}
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--ep-muted)' }}>
            {app.opening ? `${app.opening.role.title}, ${app.opening.country.name}` : `${app.role}, ${app.country}`}
          </p>
        </div>
        <span className="text-sm font-semibold px-3 py-1 rounded-full" style={{ background: stage.bg, color: stage.color }}>{stage.label}</span>
      </div>

      <Section title="Applicant">
        <dl className="grid sm:grid-cols-2 gap-3 text-sm">
          {details.filter(([, v]) => v).map(([k, v]) => (
            <div key={k}>
              <dt className="text-xs" style={{ color: 'var(--ep-muted)' }}>{k}</dt>
              <dd style={{ color: 'var(--ep-text)' }}>{v}</dd>
            </div>
          ))}
        </dl>
        {app.motivation && (
          <div>
            <p className="text-xs mb-1" style={{ color: 'var(--ep-muted)' }}>Experience and motivation</p>
            <p className="text-sm whitespace-pre-line p-3 rounded-lg" style={{ background: 'var(--ep-bg2)', color: 'var(--ep-text)' }}>{app.motivation}</p>
          </div>
        )}
      </Section>

      <Section title="Move to a stage">
        <form action={changeApplicationStage.bind(null, app.id)} className="space-y-3">
          <SelectField label="Stage" name="stage" defaultValue={app.stage} options={APPLICATION_STAGES.map((s) => ({ value: s.id, label: s.label }))} />
          <Area label="Note (optional, recorded in the timeline)" name="note" rows={2} />
          <Button type="submit" className="text-white" style={{ background: 'var(--ep-primary)', border: 'none' }}>Update stage</Button>
        </form>
      </Section>

      <Section title="Timeline">
        <form action={addApplicationNote.bind(null, app.id)} className="flex gap-2 items-start">
          <textarea
            name="note" rows={2} required placeholder="Add a note: call made, interview scheduled, reference received…"
            className="flex-1 rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: 'var(--ep-border)', background: 'var(--ep-bg)', color: 'var(--ep-text)' }}
          />
          <Button type="submit" variant="outline">Add note</Button>
        </form>
        <ol className="space-y-4 border-l-2 pl-5" style={{ borderColor: 'var(--ep-border)' }}>
          {app.events.map((e) => {
            const to = e.toStage ? getStage(e.toStage) : null
            const from = e.fromStage ? getStage(e.fromStage) : null
            return (
              <li key={e.id} className="relative">
                <span className="absolute -left-[27px] top-1.5 w-2.5 h-2.5 rounded-full" style={{ background: to?.color ?? 'var(--ep-muted)' }} />
                <p className="text-sm font-medium" style={{ color: 'var(--ep-text)' }}>
                  {e.type === 'applied' && 'Application submitted'}
                  {e.type === 'stage_change' && `${from ? `${from.label} → ` : ''}${to?.label ?? ''}`}
                  {e.type === 'note' && 'Note'}
                </p>
                {e.note && <p className="text-sm whitespace-pre-line" style={{ color: 'var(--ep-muted)' }}>{e.note}</p>}
                <p className="text-xs mt-0.5" style={{ color: 'var(--ep-muted)' }}>
                  {fmt(e.createdAt)}{e.actor ? ` · ${e.actor}` : ''}
                </p>
              </li>
            )
          })}
          {app.events.length === 0 && (
            <li className="text-sm" style={{ color: 'var(--ep-muted)' }}>
              No recorded activity (submitted {fmt(app.createdAt)}).
            </li>
          )}
        </ol>
      </Section>
    </div>
  )
}
