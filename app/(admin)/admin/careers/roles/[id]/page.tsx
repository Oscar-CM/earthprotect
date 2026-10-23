export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { createCareerRole, updateCareerRole } from '@/app/actions/careers-admin'
import { Area, Check, Field, FormActions, PageHeading, Section } from '../../_components/fields'

export default async function RoleFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const role = id === 'new' ? null : await prisma.careerRole.findUnique({ where: { id } })
  if (id !== 'new' && !role) notFound()

  const action = role ? updateCareerRole.bind(null, role.id) : createCareerRole

  return (
    <form action={action} className="space-y-5 max-w-2xl">
      <PageHeading title={role ? `Edit ${role.title}` : 'Add role'} subtitle="The default job description. Each country can add to it from its opening." />
      <Section title="Role">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Job title *" name="title" defaultValue={role?.title} required />
          <Field label="Slug (auto if blank)" name="slug" defaultValue={role?.slug} />
          <Field label="Reports to" name="reportsTo" defaultValue={role?.reportsTo} />
          <Field label="Employment type" name="employmentType" defaultValue={role?.employmentType ?? 'Full-time'} />
          <Field label="Sort order" name="sortOrder" type="number" defaultValue={role?.sortOrder ?? 0} />
        </div>
        <Area label="Summary *" name="summary" rows={4} defaultValue={role?.summary} required />
        <Check label="Published" name="published" defaultChecked={role?.published ?? true} />
      </Section>
      <Section title="Description (one item per line)">
        <Area label="Responsibilities" name="responsibilities" rows={7} defaultValue={role?.responsibilities.join('\n')} />
        <Area label="Requirements" name="requirements" rows={7} defaultValue={role?.requirements.join('\n')} />
        <Area label="Nice to have" name="niceToHave" rows={4} defaultValue={role?.niceToHave.join('\n')} />
      </Section>
      <FormActions submitLabel={role ? 'Save role' : 'Add role'} />
    </form>
  )
}
