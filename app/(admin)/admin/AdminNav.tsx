'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, FileText, Heart, PawPrint, LogOut, ShieldCheck,
  ShoppingBag, Rabbit, Users, Package, Megaphone, UserCog, BarChart2,
  Menu, X,
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

interface AdminNavProps {
  userName: string
  userEmail: string
  role: string
  signOutAction: () => Promise<void>
}

export function AdminNav({ userName, userEmail, role, signOutAction }: AdminNavProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Close sidebar on route change
  useEffect(() => { setOpen(false) }, [pathname])

  // Close on outside click / escape
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin'
    return pathname?.startsWith(href)
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="p-5 flex items-center gap-2.5 shrink-0" style={{ borderBottom: '1px solid var(--ep-border)' }}>
        <EarthProtectIcon size={28} />
        <div>
          <p className="font-bold text-sm leading-tight" style={{ color: 'var(--ep-text)' }}>Earth Protect</p>
          <p className="text-xs" style={{ color: 'var(--ep-muted)' }}>Admin Panel</p>
        </div>
        {/* Close button — mobile only */}
        <button
          onClick={() => setOpen(false)}
          className="ml-auto md:hidden p-1 rounded hover:opacity-70"
          style={{ color: 'var(--ep-muted)' }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={{
                color: active ? 'var(--ep-primary)' : 'var(--ep-text)',
                background: active ? 'color-mix(in srgb, var(--ep-primary) 10%, transparent)' : 'transparent',
              }}
            >
              <item.icon size={16} style={{ color: active ? 'var(--ep-primary)' : 'var(--ep-muted)' }} />
              {item.label}
            </Link>
          )
        })}

        {role === 'superAdmin' && (
          <>
            <div className="my-2 h-px" style={{ background: 'var(--ep-border)' }} />
            <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--ep-muted)' }}>
              Super Admin
            </p>
            {superAdminItems.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
                  style={{
                    color: active ? '#f59e0b' : 'var(--ep-text)',
                    background: active ? 'color-mix(in srgb, #f59e0b 10%, transparent)' : 'transparent',
                  }}
                >
                  <item.icon size={16} style={{ color: active ? '#f59e0b' : 'var(--ep-muted)' }} />
                  {item.label}
                </Link>
              )
            })}
          </>
        )}
      </nav>

      {/* User + sign out */}
      <div className="p-4 shrink-0" style={{ borderTop: '1px solid var(--ep-border)' }}>
        <div className="flex items-center gap-1.5 mb-0.5">
          <p className="text-xs font-semibold truncate" style={{ color: 'var(--ep-text)' }}>{userName}</p>
          {role === 'superAdmin' && <ShieldCheck size={12} style={{ color: '#f59e0b', flexShrink: 0 }} />}
        </div>
        <p className="text-xs mb-3 truncate" style={{ color: 'var(--ep-muted)' }}>{userEmail}</p>
        <form action={signOutAction}>
          <button type="submit" className="flex items-center gap-1.5 text-xs font-medium hover:opacity-70 transition-opacity" style={{ color: 'var(--ep-muted)' }}>
            <LogOut size={13} /> Sign out
          </button>
        </form>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex w-60 shrink-0 flex-col"
        style={{ background: 'var(--ep-card)', borderRight: '1px solid var(--ep-border)' }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center gap-3 px-4 py-3"
        style={{ background: 'var(--ep-card)', borderBottom: '1px solid var(--ep-border)' }}
      >
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-lg hover:opacity-70"
          style={{ color: 'var(--ep-text)' }}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <EarthProtectIcon size={24} />
        <span className="font-bold text-sm" style={{ color: 'var(--ep-text)', fontFamily: 'var(--font-lora)' }}>
          Earth<span style={{ color: 'var(--ep-primary)' }}>Protect</span>
        </span>
      </div>

      {/* Mobile drawer overlay */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-50 flex"
          onClick={() => setOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" />
          {/* Drawer */}
          <aside
            className="relative w-72 max-w-[85vw] flex flex-col h-full shadow-2xl"
            style={{ background: 'var(--ep-card)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  )
}
