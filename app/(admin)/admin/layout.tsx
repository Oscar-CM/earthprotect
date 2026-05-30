import type { ReactNode } from 'react'
import { auth, signOut } from '@/auth'
import { AdminNav } from './AdminNav'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth()
  const role = (session?.user as { role?: string })?.role ?? 'admin'

  async function handleSignOut() {
    'use server'
    await signOut({ redirectTo: '/login' })
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--ep-bg)' }}>
      <AdminNav
        userName={session?.user?.name ?? 'Admin'}
        userEmail={session?.user?.email ?? ''}
        role={role}
        signOutAction={handleSignOut}
      />
      {/* Push content down on mobile to account for fixed top bar */}
      <main className="flex-1 overflow-auto p-4 pt-20 md:pt-6 md:p-8">{children}</main>
    </div>
  )
}
