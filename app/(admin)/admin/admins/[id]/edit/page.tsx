export const dynamic = 'force-dynamic'

import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { notFound } from 'next/navigation'
import { updateAdminUser } from '@/app/actions/admins'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function EditAdminPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  const sessionRole = (session?.user as { role?: string })?.role
  if (sessionRole !== 'superAdmin') redirect('/admin')

  const { id } = await params
  const { prisma } = await import('@/lib/prisma')
  const admin = await prisma.adminUser.findUnique({ where: { id } })
  if (!admin) notFound()

  const action = updateAdminUser.bind(null, id)
  const isSelf = session?.user?.email === admin.email

  return (
    <div className="max-w-md space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/admins" className="flex items-center gap-1.5 text-sm hover:opacity-70 transition-opacity" style={{ color: 'var(--ep-muted)' }}>
          <ArrowLeft size={15} /> Back
        </Link>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}>
          Edit Admin
        </h1>
      </div>

      <form action={action} className="space-y-4 p-5 rounded-xl" style={{ background: 'var(--ep-card)', border: '1px solid var(--ep-border)' }}>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ep-text)' }}>Email</label>
          <p className="text-sm px-3 py-2 rounded-md" style={{ background: 'var(--ep-bg2)', color: 'var(--ep-muted)' }}>
            {admin.email}
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--ep-muted)' }}>Email cannot be changed after creation.</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ep-text)' }}>Full Name *</label>
          <Input name="name" required defaultValue={admin.name} placeholder="Jane Smith" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ep-text)' }}>
            New Password <span className="font-normal text-xs" style={{ color: 'var(--ep-muted)' }}>(leave blank to keep current)</span>
          </label>
          <Input name="newPassword" type="password" placeholder="Min 8 characters" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ep-text)' }}>Role</label>
          <select
            name="role"
            defaultValue={admin.role}
            disabled={isSelf}
            className="w-full rounded-md px-3 py-2 text-sm border"
            style={{ background: 'var(--ep-bg)', borderColor: 'var(--ep-border)', color: 'var(--ep-text)', opacity: isSelf ? 0.6 : 1 }}
          >
            <option value="admin">Admin</option>
            <option value="superAdmin">Super Admin</option>
          </select>
          {isSelf && (
            <input type="hidden" name="role" value={admin.role} />
          )}
          {isSelf && (
            <p className="text-xs mt-1" style={{ color: 'var(--ep-muted)' }}>You cannot change your own role.</p>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" className="text-white" style={{ background: 'var(--ep-primary)', border: 'none' }}>
            Save Changes
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
