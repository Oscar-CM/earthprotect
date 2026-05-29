export const dynamic = 'force-dynamic'

import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { createAdminUser } from '@/app/actions/admins'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function NewAdminPage() {
  const session = await auth()
  const role = (session?.user as { role?: string })?.role
  if (role !== 'superAdmin') redirect('/admin')

  return (
    <div className="max-w-md space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/admins" className="flex items-center gap-1.5 text-sm hover:opacity-70 transition-opacity" style={{ color: 'var(--ep-muted)' }}>
          <ArrowLeft size={15} /> Back
        </Link>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}>
          Add Admin
        </h1>
      </div>

      <form action={createAdminUser} className="space-y-4 p-5 rounded-xl" style={{ background: 'var(--ep-card)', border: '1px solid var(--ep-border)' }}>
        <Field label="Full Name *" name="name" required placeholder="Jane Smith" />
        <Field label="Email *" name="email" type="email" required placeholder="jane@earthprotect.org" />
        <Field label="Password *" name="password" type="password" required placeholder="Min 8 characters" />

        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ep-text)' }}>Role</label>
          <select
            name="role"
            className="w-full rounded-md px-3 py-2 text-sm border"
            style={{ background: 'var(--ep-bg)', borderColor: 'var(--ep-border)', color: 'var(--ep-text)' }}
          >
            <option value="admin">Admin</option>
            <option value="superAdmin">Super Admin</option>
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" className="text-white" style={{ background: 'var(--ep-primary)', border: 'none' }}>
            Create Admin
          </Button>
          <Link href="/admin/admins">
            <Button type="button" variant="outline" style={{ borderColor: 'var(--ep-border)', color: 'var(--ep-text)' }}>
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}

function Field({ label, name, type = 'text', required, placeholder }: {
  label: string; name: string; type?: string; required?: boolean; placeholder?: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ep-text)' }}>
        {label}{required && <span style={{ color: '#dc2626' }}> *</span>}
      </label>
      <Input name={name} type={type} required={required} placeholder={placeholder} />
    </div>
  )
}
