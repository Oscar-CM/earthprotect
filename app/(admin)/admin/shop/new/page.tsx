export const dynamic = 'force-dynamic'

import { createShopItem } from '@/app/actions/shop'
import { ShopItemForm } from '../_components/ShopItemForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewShopItemPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/shop" className="flex items-center gap-1.5 text-sm hover:opacity-70 transition-opacity" style={{ color: 'var(--ep-muted)' }}>
          <ArrowLeft size={15} /> Back
        </Link>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}>
          New Shop Item
        </h1>
      </div>
      <ShopItemForm action={createShopItem} />
    </div>
  )
}
