export const dynamic = 'force-dynamic'

import type { ReactNode } from 'react'
import { ThemeProvider } from '@/context/ThemeContext'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { VisitTracker } from '@/components/shared/VisitTracker'

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <VisitTracker />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </ThemeProvider>
  )
}
