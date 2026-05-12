import type { ReactNode } from 'react'
import Link from 'next/link'
import { auth, signOut } from '@/auth'
import {
  LayoutDashboard,
  FileText,
  Heart,
  PawPrint,
  LogOut,
  ShieldCheck,
  ShoppingBag,
  Rabbit,
  Users,
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Animals', href: '/admin/animals', icon: Rabbit },
  { label: 'Blog Posts', href: '/admin/blog', icon: FileText },
  { label: 'Members', href: '/admin/members', icon: Users },
  { label: 'Donors', href: '/admin/donors', icon: Heart },
  { label: 'Adopters', href: '/admin/adopters', icon: PawPrint },
  { label: 'Shop Orders', href: '/admin/orders', icon: ShoppingBag },
]

export default async function AdminLayout({ children }: { children: ReactNode }) {
  // Auth is enforced by middleware — layout just reads session for display
  const session = await auth()

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--ep-bg)' }}>
      {/* Sidebar */}
      <aside
        className="w-60 shrink-0 flex flex-col"
        style={{ background: 'var(--ep-card)', borderRight: '1px solid var(--ep-border)' }}
      >
        {/* Brand */}
        <div className="p-5 flex items-center gap-2.5" style={{ borderBottom: '1px solid var(--ep-border)' }}>
          <ShieldCheck size={22} style={{ color: 'var(--ep-primary)' }} />
          <div>
            <p className="font-bold text-sm leading-tight" style={{ color: 'var(--ep-text)' }}>
              Earth Protect
            </p>
            <p className="text-xs" style={{ color: 'var(--ep-muted)' }}>
              Admin Panel
            </p>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: 'var(--ep-text)' }}
            >
              <item.icon size={16} style={{ color: 'var(--ep-primary)' }} />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User + logout */}
        <div className="p-4" style={{ borderTop: '1px solid var(--ep-border)' }}>
          <p className="text-xs mb-0.5 font-semibold truncate" style={{ color: 'var(--ep-text)' }}>
            {session?.user?.name ?? 'Admin'}
          </p>
          <p className="text-xs mb-3 truncate" style={{ color: 'var(--ep-muted)' }}>
            {session?.user?.email ?? ''}
          </p>
          <form
            action={async () => {
              'use server'
              await signOut({ redirectTo: '/admin/login' })
            }}
          >
            <button
              type="submit"
              className="flex items-center gap-1.5 text-xs font-medium hover:opacity-70 transition-opacity"
              style={{ color: 'var(--ep-muted)' }}
            >
              <LogOut size={13} />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-6 md:p-8">{children}</main>
    </div>
  )
}
