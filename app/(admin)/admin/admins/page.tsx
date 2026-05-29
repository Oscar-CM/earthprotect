export const dynamic = 'force-dynamic'

import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { deleteAdminUser } from '@/app/actions/admins'
import { Plus, Pencil, Trash2, ShieldCheck, Shield } from 'lucide-react'

type AdminRow = {
  id: string; email: string; name: string; role: string; createdAt: Date
}

export default async function AdminsPage() {
  const session = await auth()
  const role = (session?.user as { role?: string })?.role
  if (role !== 'superAdmin') redirect('/admin')

  let admins: AdminRow[] = []
  try {
    const { prisma } = await import('@/lib/prisma')
    admins = await prisma.adminUser.findMany({ orderBy: { createdAt: 'asc' } }) as AdminRow[]
  } catch { /* DB not connected */ }

  const selfEmail = session?.user?.email

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}>
            Admin Users
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--ep-muted)' }}>
            {admins.length} admin{admins.length !== 1 ? 's' : ''} · only visible to Super Admins
          </p>
        </div>
        <Link href="/admin/admins/new">
          <Button className="flex items-center gap-1.5 text-white" style={{ background: 'var(--ep-primary)', border: 'none' }}>
            <Plus size={16} /> Add Admin
          </Button>
        </Link>
      </div>

      <div
        className="p-4 rounded-xl text-sm"
        style={{ background: 'color-mix(in srgb, #f59e0b 10%, transparent)', border: '1px solid color-mix(in srgb, #f59e0b 30%, transparent)' }}
      >
        <p className="font-semibold mb-1" style={{ color: 'var(--ep-text)' }}>Super Admin credentials are stored locally</p>
        <p style={{ color: 'var(--ep-muted)' }}>
          To change the Super Admin email or password, update <code className="text-xs px-1 py-0.5 rounded" style={{ background: 'var(--ep-bg2)' }}>.env.local</code> and re-run <code className="text-xs px-1 py-0.5 rounded" style={{ background: 'var(--ep-bg2)' }}>npm run db:seed</code>.
        </p>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--ep-border)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: 'var(--ep-bg2)', borderBottom: '1px solid var(--ep-border)' }}>
              {['Name', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 font-semibold" style={{ color: 'var(--ep-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {admins.map(admin => (
              <tr key={admin.id} style={{ background: 'var(--ep-card)', borderBottom: '1px solid var(--ep-border)' }}>
                <td className="px-4 py-3">
                  <p className="font-medium" style={{ color: 'var(--ep-text)' }}>
                    {admin.name}
                    {admin.email === selfEmail && (
                      <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded font-semibold" style={{ background: 'color-mix(in srgb, var(--ep-primary) 15%, transparent)', color: 'var(--ep-primary)' }}>
                        You
                      </span>
                    )}
                  </p>
                </td>
                <td className="px-4 py-3" style={{ color: 'var(--ep-muted)' }}>{admin.email}</td>
                <td className="px-4 py-3">
                  {admin.role === 'superAdmin' ? (
                    <Badge className="text-xs gap-1" style={{ background: '#fef3c7', color: '#92400e', border: 'none' }}>
                      <ShieldCheck size={11} /> Super Admin
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs gap-1">
                      <Shield size={11} /> Admin
                    </Badge>
                  )}
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--ep-muted)' }}>
                  {new Date(admin.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/admins/${admin.id}/edit`}>
                      <button className="p-1.5 rounded hover:opacity-70" style={{ color: 'var(--ep-muted)' }} title="Edit">
                        <Pencil size={14} />
                      </button>
                    </Link>
                    {admin.email !== selfEmail && (
                      <form action={async () => { 'use server'; await deleteAdminUser(admin.id) }}>
                        <button type="submit" className="p-1.5 rounded hover:opacity-70" style={{ color: '#dc2626' }} title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </form>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
