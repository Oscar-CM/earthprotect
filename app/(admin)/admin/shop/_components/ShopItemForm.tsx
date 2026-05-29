'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'

type DefaultValues = {
  slug?: string
  name?: string
  description?: string
  price?: number
  imageUrl?: string
  category?: string
  tags?: string[]
  inStock?: boolean
  proceedsNote?: string
  published?: boolean
}

interface ShopItemFormProps {
  action: (formData: FormData) => Promise<void>
  defaultValues?: DefaultValues
}

const CATEGORIES = [
  { value: 'apparel', label: 'Apparel' },
  { value: 'prints', label: 'Art Prints' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'digital', label: 'Digital' },
]

export function ShopItemForm({ action, defaultValues }: ShopItemFormProps) {
  const isEdit = !!defaultValues?.name

  return (
    <form action={action} className="space-y-5 max-w-2xl">
      <Section title="Product Info">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Product Name *" name="name" defaultValue={defaultValues?.name} placeholder="e.g. Elephant Guardian T-Shirt" required />
          <Field label="Slug (auto if blank)" name="slug" defaultValue={defaultValues?.slug} placeholder="elephant-guardian-tee" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ep-text)' }}>
            Description *
          </label>
          <Textarea
            name="description"
            required
            rows={3}
            defaultValue={defaultValues?.description}
            placeholder="Organic cotton tee featuring original wildlife artwork…"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Price ($) *" name="price" type="number" defaultValue={String(defaultValues?.price ?? '')} placeholder="29.99" required />
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ep-text)' }}>
              Category *
            </label>
            <select
              name="category"
              defaultValue={defaultValues?.category ?? ''}
              required
              className="w-full rounded-md px-3 py-2 text-sm border"
              style={{ background: 'var(--ep-bg)', borderColor: 'var(--ep-border)', color: 'var(--ep-text)' }}
            >
              <option value="">Select category…</option>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
        </div>
      </Section>

      <Section title="Media">
        <Field label="Image URL *" name="imageUrl" defaultValue={defaultValues?.imageUrl} placeholder="https://images.unsplash.com/photo-...?w=800&q=80" required />
        {defaultValues?.imageUrl && (
          <img
            src={defaultValues.imageUrl}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg mt-2"
            style={{ border: '1px solid var(--ep-border)' }}
          />
        )}
      </Section>

      <Section title="Details">
        <Field
          label="Tags (comma-separated)"
          name="tags"
          defaultValue={defaultValues?.tags?.join(', ')}
          placeholder="wildlife, elephant, organic"
        />
        <Field
          label="Proceeds Note"
          name="proceedsNote"
          defaultValue={defaultValues?.proceedsNote ?? '100% supports wildlife conservation'}
          placeholder="100% supports wildlife conservation"
        />
      </Section>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm font-medium cursor-pointer" style={{ color: 'var(--ep-text)' }}>
          <input type="checkbox" name="inStock" defaultChecked={defaultValues?.inStock ?? true} className="w-4 h-4" />
          In Stock
        </label>
        <label className="flex items-center gap-2 text-sm font-medium cursor-pointer" style={{ color: 'var(--ep-text)' }}>
          <input type="checkbox" name="published" defaultChecked={defaultValues?.published ?? true} className="w-4 h-4" />
          Publish (visible on shop)
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" className="text-white" style={{ background: 'var(--ep-primary)', border: 'none' }}>
          {isEdit ? 'Save Changes' : 'Add Item'}
        </Button>
        <Link href="/admin/shop">
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
