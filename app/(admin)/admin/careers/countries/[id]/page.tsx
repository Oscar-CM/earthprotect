export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { createCareerCountry, updateCareerCountry } from '@/app/actions/careers-admin'
import { Area, Check, Field, FormActions, PageHeading, Section } from '../../_components/fields'

export default async function CountryFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const country = id === 'new' ? null : await prisma.careerCountry.findUnique({ where: { id } })
  if (id !== 'new' && !country) notFound()

  const action = country ? updateCareerCountry.bind(null, country.id) : createCareerCountry

  return (
    <form action={action} className="space-y-5 max-w-2xl">
      <PageHeading title={country ? `Edit ${country.name}` : 'Add country'} subtitle="Country details and the vetting and legal requirements shown to applicants." />
      <Section title="Country">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Country name *" name="name" defaultValue={country?.name} required />
          <Field label="ISO code *" name="code" defaultValue={country?.code} required placeholder="KE" />
          <Field label="Flag emoji" name="flag" defaultValue={country?.flag} placeholder="🇰🇪" />
          <Field label="Region" name="region" defaultValue={country?.region} placeholder="East Africa" />
        </div>
        <Field label="Conservation focus" name="focus" defaultValue={country?.focus} />
        <Field label="Working languages" name="languages" defaultValue={country?.languages} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Sort order" name="sortOrder" type="number" defaultValue={country?.sortOrder ?? 0} hint="Lower numbers appear first." />
        </div>
        <Check label="Published (visible on the careers page)" name="published" defaultChecked={country?.published ?? true} />
      </Section>
      <Section title="Country requirements">
        <Area label="Candidate vetting checks" name="verification" rows={5} defaultValue={country?.verification.join('\n')} hint="One check per line." />
        <Area label="Laws the team must follow" name="laws" rows={5} defaultValue={country?.laws.join('\n')} hint="One item per line." />
      </Section>
      <FormActions submitLabel={country ? 'Save country' : 'Add country'} />
    </form>
  )
}
