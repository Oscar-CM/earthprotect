import type { ReactNode } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const inputStyle = {
  borderColor: 'var(--ep-border)',
  background: 'var(--ep-bg)',
  color: 'var(--ep-text)',
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="p-5 rounded-xl space-y-4" style={{ background: 'var(--ep-card)', border: '1px solid var(--ep-border)' }}>
      <h2 className="font-semibold text-sm" style={{ color: 'var(--ep-text)' }}>{title}</h2>
      {children}
    </div>
  )
}

export function Field({
  label, name, defaultValue, hint, type = 'text', required, placeholder,
}: {
  label: string; name: string; defaultValue?: string | number | null; hint?: string
  type?: string; required?: boolean; placeholder?: string
}) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-medium" style={{ color: 'var(--ep-muted)' }}>{label}</span>
      <input
        name={name} type={type} required={required} placeholder={placeholder}
        defaultValue={defaultValue ?? ''}
        className="w-full rounded-lg border px-3 py-2 text-sm" style={inputStyle}
      />
      {hint && <span className="block text-xs" style={{ color: 'var(--ep-muted)' }}>{hint}</span>}
    </label>
  )
}

export function Area({
  label, name, defaultValue, hint, rows = 5, required,
}: {
  label: string; name: string; defaultValue?: string | null; hint?: string; rows?: number; required?: boolean
}) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-medium" style={{ color: 'var(--ep-muted)' }}>{label}</span>
      <textarea
        name={name} rows={rows} required={required} defaultValue={defaultValue ?? ''}
        className="w-full rounded-lg border px-3 py-2 text-sm" style={inputStyle}
      />
      {hint && <span className="block text-xs" style={{ color: 'var(--ep-muted)' }}>{hint}</span>}
    </label>
  )
}

export function Check({ label, name, defaultChecked }: { label: string; name: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center gap-2 text-sm" style={{ color: 'var(--ep-text)' }}>
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="w-4 h-4" style={{ accentColor: 'var(--ep-primary)' }} />
      {label}
    </label>
  )
}

export function SelectField({
  label, name, defaultValue, options,
}: {
  label: string; name: string; defaultValue?: string
  options: { value: string; label: string }[]
}) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-medium" style={{ color: 'var(--ep-muted)' }}>{label}</span>
      <select
        name={name} defaultValue={defaultValue}
        className="w-full rounded-lg border px-3 py-2 text-sm" style={inputStyle}
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  )
}

export function FormActions({ submitLabel }: { submitLabel: string }) {
  return (
    <div className="flex items-center gap-3">
      <Button type="submit" className="text-white" style={{ background: 'var(--ep-primary)', border: 'none' }}>
        {submitLabel}
      </Button>
      <Link href="/admin/careers" className="text-sm" style={{ color: 'var(--ep-muted)' }}>Cancel</Link>
    </div>
  )
}

export function PageHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}>{title}</h1>
      {subtitle && <p className="text-sm mt-1" style={{ color: 'var(--ep-muted)' }}>{subtitle}</p>}
    </div>
  )
}
