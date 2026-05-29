'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'

type Fact = { label: string; value: string }
type Tier = { label: string; amount: number; description: string; perks: string[] }

type DefaultValues = {
  slug?: string
  name?: string
  species?: string
  commonName?: string
  region?: string
  countries?: string[]
  conservationStatus?: string
  populationCurrent?: number | null
  populationTrend?: string
  populationYear?: number
  habitat?: string[]
  description?: string
  extendedDescription?: string | null
  imageUrl?: string
  thumbnailUrl?: string
  facts?: unknown
  adoptionTiers?: unknown
  fundingGoal?: number
  published?: boolean
}

interface AnimalFormProps {
  action: (formData: FormData) => Promise<void>
  defaultValues?: DefaultValues
}

const REGIONS = ['East Africa', 'Southern Africa', 'Central Africa', 'West Africa', 'North Africa']
const STATUSES = ['Critically Endangered', 'Endangered', 'Vulnerable', 'Near Threatened', 'Least Concern', 'Extinct in the Wild', 'Extinct']
const TRENDS = ['Increasing', 'Decreasing', 'Stable', 'Unknown']

function parseFacts(raw: unknown): Fact[] {
  if (!Array.isArray(raw)) return [{ label: '', value: '' }, { label: '', value: '' }, { label: '', value: '' }, { label: '', value: '' }]
  return raw as Fact[]
}

function parseTiers(raw: unknown): Tier[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    return [
      { label: 'Basic Sponsor', amount: 15, description: 'Support this animal', perks: ['Digital certificate', 'Monthly update'] },
      { label: 'Guardian', amount: 35, description: 'Full habitat protection', perks: ['Digital certificate', 'Monthly update', 'Photo print'] },
    ]
  }
  return raw as Tier[]
}

export function AnimalForm({ action, defaultValues }: AnimalFormProps) {
  const facts = parseFacts(defaultValues?.facts)
  const tiers = parseTiers(defaultValues?.adoptionTiers)

  return (
    <form action={action} className="space-y-6">
      {/* Basic info */}
      <Section title="Basic Information">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Animal Name *" name="name" defaultValue={defaultValues?.name} placeholder="e.g. African Lion" required />
          <Field label="Slug (auto if blank)" name="slug" defaultValue={defaultValues?.slug} placeholder="african-lion" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Species (Latin name) *" name="species" defaultValue={defaultValues?.species} placeholder="Panthera leo" required />
          <Field label="Common Name" name="commonName" defaultValue={defaultValues?.commonName} placeholder="African Lion" />
        </div>
      </Section>

      {/* Location */}
      <Section title="Location">
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ep-text)' }}>Region *</label>
          <select
            name="region"
            defaultValue={defaultValues?.region ?? ''}
            required
            className="w-full rounded-md px-3 py-2 text-sm border"
            style={{ background: 'var(--ep-bg)', borderColor: 'var(--ep-border)', color: 'var(--ep-text)' }}
          >
            <option value="">Select region…</option>
            {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <Field
          label="Countries (comma-separated) *"
          name="countries"
          defaultValue={defaultValues?.countries?.join(', ')}
          placeholder="Kenya, Tanzania, Uganda"
          required
        />
        <Field
          label="Habitats (comma-separated) *"
          name="habitat"
          defaultValue={defaultValues?.habitat?.join(', ')}
          placeholder="Savannah, Grassland, Woodland"
          required
        />
      </Section>

      {/* Conservation status */}
      <Section title="Conservation Status">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ep-text)' }}>IUCN Status *</label>
            <select
              name="conservationStatus"
              defaultValue={defaultValues?.conservationStatus ?? ''}
              required
              className="w-full rounded-md px-3 py-2 text-sm border"
              style={{ background: 'var(--ep-bg)', borderColor: 'var(--ep-border)', color: 'var(--ep-text)' }}
            >
              <option value="">Select status…</option>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ep-text)' }}>Population Trend</label>
            <select
              name="populationTrend"
              defaultValue={defaultValues?.populationTrend ?? 'Stable'}
              className="w-full rounded-md px-3 py-2 text-sm border"
              style={{ background: 'var(--ep-bg)', borderColor: 'var(--ep-border)', color: 'var(--ep-text)' }}
            >
              {TRENDS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Estimated Population (leave blank if unknown)" name="populationCurrent" defaultValue={defaultValues?.populationCurrent?.toString() ?? ''} placeholder="23000" type="number" />
          <Field label="Population Year" name="populationYear" defaultValue={String(defaultValues?.populationYear ?? 2024)} placeholder="2024" type="number" />
        </div>
      </Section>

      {/* Description */}
      <Section title="Photos">
        <Field label="Main Image URL *" name="imageUrl" defaultValue={defaultValues?.imageUrl} placeholder="https://images.unsplash.com/photo-...?w=1200&q=80" required />
        <Field
          label="Thumbnail URL"
          name="thumbnailUrl"
          defaultValue={defaultValues?.thumbnailUrl ?? ''}
          placeholder="https://images.unsplash.com/photo-...?w=400&q=80 (auto-derived from main image if blank)"
        />
        {defaultValues?.imageUrl && (
          <div className="flex gap-3 mt-2">
            <img src={defaultValues.imageUrl} alt="Main" className="w-24 h-16 object-cover rounded-lg" style={{ border: '1px solid var(--ep-border)' }} />
            {defaultValues.thumbnailUrl && (
              <img src={defaultValues.thumbnailUrl} alt="Thumb" className="w-16 h-16 object-cover rounded-lg" style={{ border: '1px solid var(--ep-border)' }} />
            )}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ep-text)' }}>
            Main Description * <span className="font-normal text-xs" style={{ color: 'var(--ep-muted)' }}>(1–3 sentences shown on card)</span>
          </label>
          <Textarea name="description" required rows={3} defaultValue={defaultValues?.description} placeholder="The African lion is the king of the savannah…" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ep-text)' }}>
            Extended Description <span className="font-normal text-xs" style={{ color: 'var(--ep-muted)' }}>(optional — shown on detail page)</span>
          </label>
          <Textarea name="extendedDescription" rows={4} defaultValue={defaultValues?.extendedDescription ?? ''} placeholder="Additional paragraphs for the animal detail page…" />
        </div>
      </Section>

      {/* Key facts */}
      <Section title="Key Facts (up to 6)">
        <div className="space-y-2">
          {[1, 2, 3, 4, 5, 6].map(i => {
            const fact = facts[i - 1] ?? { label: '', value: '' }
            return (
              <div key={i} className="grid grid-cols-2 gap-2">
                <Input name={`fact_label_${i}`} defaultValue={fact.label} placeholder={`Fact ${i} label (e.g. Weight)`} />
                <Input name={`fact_value_${i}`} defaultValue={fact.value} placeholder={`Fact ${i} value (e.g. 150–250 kg)`} />
              </div>
            )
          })}
        </div>
      </Section>

      {/* Adoption tiers */}
      <Section title="Adoption Tiers (2)">
        {[1, 2].map(i => {
          const tier = tiers[i - 1]
          return (
            <div key={i} className="p-4 rounded-lg space-y-2" style={{ background: 'var(--ep-bg2)', border: '1px solid var(--ep-border)' }}>
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--ep-muted)' }}>Tier {i}</p>
              <div className="grid grid-cols-2 gap-2">
                <Input name={`tier_label_${i}`} defaultValue={tier?.label} placeholder={i === 1 ? 'Basic Sponsor' : 'Guardian'} />
                <Input name={`tier_amount_${i}`} type="number" defaultValue={String(tier?.amount ?? (i === 1 ? 15 : 35))} placeholder="Amount ($/month)" />
              </div>
              <Input name={`tier_desc_${i}`} defaultValue={tier?.description} placeholder="Short description of this tier" />
              <Input
                name={`tier_perks_${i}`}
                defaultValue={tier?.perks?.join(', ')}
                placeholder="Perks (comma-separated): Digital certificate, Monthly update"
              />
            </div>
          )
        })}
      </Section>

      {/* Funding */}
      <Section title="Funding">
        <Field label="Funding Goal ($)" name="fundingGoal" defaultValue={String(defaultValues?.fundingGoal ?? 30000)} type="number" placeholder="30000" />
      </Section>

      {/* Publish */}
      <div className="flex items-center gap-2">
        <input type="checkbox" id="published" name="published" defaultChecked={defaultValues?.published ?? true} className="w-4 h-4" />
        <label htmlFor="published" className="text-sm font-medium" style={{ color: 'var(--ep-text)' }}>
          Publish immediately (visible on public site)
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" className="text-white" style={{ background: 'var(--ep-primary)', border: 'none' }}>
          {defaultValues?.name ? 'Save Changes' : 'Add Animal'}
        </Button>
        <Link href="/admin/animals">
          <Button type="button" variant="outline" style={{ borderColor: 'var(--ep-border)', color: 'var(--ep-text)' }}>
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-bold uppercase tracking-wide" style={{ color: 'var(--ep-muted)' }}>{title}</h2>
      <div className="space-y-3 p-4 rounded-xl" style={{ background: 'var(--ep-card)', border: '1px solid var(--ep-border)' }}>
        {children}
      </div>
    </div>
  )
}

function Field({
  label, name, required, defaultValue, placeholder, type = 'text',
}: {
  label: string; name: string; required?: boolean
  defaultValue?: string; placeholder?: string; type?: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ep-text)' }}>
        {label}{required && <span style={{ color: '#dc2626' }}> *</span>}
      </label>
      <Input name={name} required={required} defaultValue={defaultValue} placeholder={placeholder} type={type} />
    </div>
  )
}
