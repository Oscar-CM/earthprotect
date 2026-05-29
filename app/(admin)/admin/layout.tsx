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
  Package,
  Megaphone,
  UserCog,
  BarChart2,
} from 'lucide-react'
import { EarthProtectIcon } from '@/components/shared/EarthProtectLogo'

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Animals', href: '/admin/animals', icon: Rabbit },
  { label: 'Blog Posts', href: '/admin/blog', icon: FileText },
  { label: 'Ads', href: '/admin/ads', icon: Megaphone },
  { label: 'Shop Items', href: '/admin/shop', icon: Package },
  { label: 'Members', href: '/admin/members', icon: Users },
  { label: 'Donors', href: '/admin/donors', icon: Heart },
  { label: 'Adopters', href: '/admin/adopters', icon: PawPrint },
  { label: 'Shop Orders', href: '/admin/orders', icon: ShoppingBag },
]

const superAdminItems = [
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart2 },
  { label: 'Admin Users', href: '/admin/admins', icon: UserCog },
]

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth()
  const role = (session?.user as { role?: string })?.role

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--ep-bg)' }}>
      {/* Sidebar */}
      <aside
        className="w-60 shrink-0 flex flex-col"
        style={{ background: 'var(--ep-card)', borderRight: '1px solid var(--ep-border)' }}
      >
        {/* Brand */}
        <div className="p-5 flex items-center gap-2.5" style={{ borderBottom: '1px solid var(--ep-border)' }}>
          <EarthProtectIcon size={28} />
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
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
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

          {role === 'superAdmin' && (
            <>
              <div className="my-2 h-px" style={{ background: 'var(--ep-border)' }} />
              <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--ep-muted)' }}>
                Super Admin
              </p>
              {superAdminItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:opacity-80"
                  style={{ color: 'var(--ep-text)' }}
                >
                  <item.icon size={16} style={{ color: '#f59e0b' }} />
                  {item.label}
                </Link>
              ))}
            </>
          )}
        </nav>

        {/* User + logout */}
        <div className="p-4" style={{ borderTop: '1px solid var(--ep-border)' }}>
          <div className="flex items-center gap-1.5 mb-0.5">
            <p className="text-xs font-semibold truncate" style={{ color: 'var(--ep-text)' }}>
              {session?.user?.name ?? 'Admin'}
            </p>
            {role === 'superAdmin' && (
              <ShieldCheck size={12} style={{ color: '#f59e0b', flexShrink: 0 }} />
            )}
          </div>
          <p className="text-xs mb-3 truncate" style={{ color: 'var(--ep-muted)' }}>
            {session?.user?.email ?? ''}
          </p>
          <form
            action={async () => {
              'use server'
              await signOut({ redirectTo: '/login' })
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
