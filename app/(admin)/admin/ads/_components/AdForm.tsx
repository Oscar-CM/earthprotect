'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'

type DefaultValues = {
  slug?: string
  title?: string
  description?: string | null
  imageUrl?: string | null
  linkUrl?: string | null
  linkText?: string | null
  type?: string
  htmlContent?: string | null
  active?: boolean
}

interface AdFormProps {
  action: (formData: FormData) => Promise<void>
  defaultValues?: DefaultValues
}

const AD_TYPES = [
  { value: 'inline', label: 'Inline (embedded in article text)' },
  { value: 'banner', label: 'Banner (full-width image ad)' },
  { value: 'sidebar', label: 'Sidebar (compact)' },
]

export function AdForm({ action, defaultValues }: AdFormProps) {
  const isEdit = !!defaultValues?.title

  return (
    <form action={action} className="space-y-5 max-w-2xl">
      <Section title="Ad Details">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Ad Title *" name="title" defaultValue={defaultValues?.title} placeholder="e.g. Conservation T-Shirt Promo" required />
          <Field label="Slug (auto if blank)" name="slug" defaultValue={defaultValues?.slug} placeholder="conservation-tshirt-promo" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ep-text)' }}>
            Type
          </label>
          <select
            name="type"
            defaultValue={defaultValues?.type ?? 'inline'}
            className="w-full rounded-md px-3 py-2 text-sm border"
            style={{ background: 'var(--ep-bg)', borderColor: 'var(--ep-border)', color: 'var(--ep-text)' }}
          >
            {AD_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ep-text)' }}>
            Description / Body text
          </label>
          <Textarea
            name="description"
            rows={2}
            defaultValue={defaultValues?.description ?? ''}
            placeholder="Short ad copy shown below the title…"
          />
        </div>
      </Section>

      <Section title="Image & Link">
        <Field label="Image URL" name="imageUrl" defaultValue={defaultValues?.imageUrl ?? ''} placeholder="https://images.unsplash.com/..." />
        {defaultValues?.imageUrl && (
          <img src={defaultValues.imageUrl} alt="Preview" className="w-full max-w-xs h-32 object-cover rounded-lg mt-2" style={{ border: '1px solid var(--ep-border)' }} />
        )}
        <div className="grid grid-cols-2 gap-3">
          <Field label="Link URL" name="linkUrl" defaultValue={defaultValues?.linkUrl ?? ''} placeholder="https://earthprotect.org/shop" />
          <Field label="Link Button Text" name="linkText" defaultValue={defaultValues?.linkText ?? ''} placeholder="Shop Now" />
        </div>
      </Section>

      <Section title="Custom HTML (optional)">
        <p className="text-xs" style={{ color: 'var(--ep-muted)' }}>
          Advanced: enter raw HTML to fully override the ad rendering. Leave blank to use the image/text layout above.
        </p>
        <Textarea
          name="htmlContent"
          rows={4}
          defaultValue={defaultValues?.htmlContent ?? ''}
          placeholder="<div class=&quot;...&quot;>Custom ad HTML here</div>"
        />
      </Section>

      <div
        className="p-4 rounded-xl text-sm"
        style={{ background: 'color-mix(in srgb, var(--ep-primary) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--ep-primary) 30%, transparent)' }}
      >
        <p className="font-semibold mb-1" style={{ color: 'var(--ep-text)' }}>How to embed this ad in a blog post</p>
        {defaultValues?.slug ? (
          <code
            className="text-sm font-mono px-2 py-1 rounded"
            style={{ background: 'var(--ep-bg2)', color: 'var(--ep-primary)' }}
          >
            {`{{ad:${defaultValues.slug}}}`}
          </code>
        ) : (
          <p style={{ color: 'var(--ep-muted)' }}>After saving, you will get a shortcode like <code>{'{{ad:your-slug}}'}</code> to paste into any blog post content.</p>
        )}
      </div>

      <label className="flex items-center gap-2 text-sm font-medium cursor-pointer" style={{ color: 'var(--ep-text)' }}>
        <input type="checkbox" name="active" defaultChecked={defaultValues?.active ?? true} className="w-4 h-4" />
        Active (renders when embedded in posts)
      </label>

      <div className="flex gap-3 pt-2">
        <Button type="submit" className="text-white" style={{ background: 'var(--ep-primary)', border: 'none' }}>
          {isEdit ? 'Save Changes' : 'Create Ad'}
        </Button>
        <Link href="/admin/ads">
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
