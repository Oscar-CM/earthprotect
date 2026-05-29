export const dynamic = 'force-dynamic'

import { createAd } from '@/app/actions/ads'
import { AdForm } from '../_components/AdForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewAdPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/ads" className="flex items-center gap-1.5 text-sm hover:opacity-70 transition-opacity" style={{ color: 'var(--ep-muted)' }}>
          <ArrowLeft size={15} /> Back
        </Link>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}>
          New Ad
        </h1>
      </div>
      <AdForm action={createAd} />
    </div>
  )
}
