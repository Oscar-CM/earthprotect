export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { createCareerOpening, updateCareerOpening } from '@/app/actions/careers-admin'
import { OPENING_STATUSES, timelineToText } from '@/lib/careers'
import Link from 'next/link'
import { Area, Field, FormActions, FormError, PageHeading, Section, SelectField } from '../../_components/fields'

const dateInput = (d: Date | null | undefined) => (d ? d.toISOString().slice(0, 10) : '')

export default async function OpeningFormPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string }>
}) {
  const { id } = await params
  const { error } = await searchParams
  const [opening, countries, roles] = await Promise.all([
    id === 'new' ? null : prisma.careerOpening.findUnique({ where: { id }, include: { country: true, role: true } }),
    prisma.careerCountry.findMany({ orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] }),
    prisma.careerRole.findMany({ orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }] }),
  ])
  if (id !== 'new' && !opening) notFound()

  const action = opening ? updateCareerOpening.bind(null, opening.id) : createCareerOpening

  if (!opening && (countries.length === 0 || roles.length === 0)) {
    return (
      <div className="space-y-4 max-w-2xl">
        <PageHeading title="Add opening" subtitle="An opening is a role in a specific country." />
        <Section title="Add these first">
          <p className="text-sm" style={{ color: 'var(--ep-muted)' }}>
            You need at least one country and one role before you can create an opening.
          </p>
          <div className="flex gap-4 text-sm underline" style={{ color: 'var(--ep-primary)' }}>
            {countries.length === 0 && <Link href="/admin/careers/countries/new">Add a country</Link>}
            {roles.length === 0 && <Link href="/admin/careers/roles/new">Add a role</Link>}
          </div>
        </Section>
      </div>
    )
  }

  const hiddenNote = (c: { published: boolean }) => (c.published ? '' : ' (hidden)')

  return (
    <form action={action} className="space-y-5 max-w-2xl">
      <PageHeading
        title={opening ? `${opening.role.title}, ${opening.country.name}` : 'Add opening'}
        subtitle="A role in a specific country. Anything added here is shown on top of the default job description."
      />
      <FormError message={error} />
      <Section title="Position">
        {opening ? (
          <p className="text-sm" style={{ color: 'var(--ep-muted)' }}>
            {opening.role.title} · {opening.country.name}. Country and role are fixed; create a new opening to change them.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <SelectField label="Country *" name="countryId" options={countries.map((c) => ({ value: c.id, label: `${c.flag} ${c.name}${hiddenNote(c)}` }))} />
            <SelectField label="Role *" name="roleId" options={roles.map((r) => ({ value: r.id, label: `${r.title}${hiddenNote(r)}` }))} />
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          <SelectField label="Status" name="status" defaultValue={opening?.status ?? 'open'} options={OPENING_STATUSES.map((s) => ({ value: s.id, label: s.label }))} />
          <Field label="Number of positions" name="positions" type="number" defaultValue={opening?.positions ?? 1} />
          <Field label="Location" name="location" defaultValue={opening?.location} placeholder="Nairobi, with field travel" />
          <Field label="Salary / pay" name="salary" defaultValue={opening?.salary} placeholder="Competitive, paid in local currency" />
          <Field label="Applications open on" name="opensAt" type="date" defaultValue={dateInput(opening?.opensAt)} hint="Blank = open immediately." />
          <Field label="Applications close on" name="closesAt" type="date" defaultValue={dateInput(opening?.closesAt)} hint="Blank = no deadline." />
        </div>
      </Section>
      <Section title="Country-specific requirements (one item per line)">
        <Area label="Replacement summary" name="summaryOverride" rows={3} defaultValue={opening?.summaryOverride} hint="Leave blank to use the role's default summary." />
        <Area label="Extra responsibilities" name="extraResponsibilities" rows={4} defaultValue={opening?.extraResponsibilities.join('\n')} />
        <Area label="Extra requirements" name="extraRequirements" rows={4} defaultValue={opening?.extraRequirements.join('\n')} hint="e.g. French fluency, a work permit, a local licence." />
        <Area label="Extra nice-to-haves" name="extraNiceToHave" rows={3} defaultValue={opening?.extraNiceToHave.join('\n')} />
      </Section>
      <Section title="Hiring timeline">
        <Area label="Milestones shown to applicants" name="timeline" rows={5} defaultValue={timelineToText(opening?.timeline)} hint="One per line as: 2026-11-01 | Interviews begin" />
        <Area label="Internal notes (never shown publicly)" name="internalNotes" rows={3} defaultValue={opening?.internalNotes} />
      </Section>
      <FormActions submitLabel={opening ? 'Save opening' : 'Add opening'} />
    </form>
  )
}
