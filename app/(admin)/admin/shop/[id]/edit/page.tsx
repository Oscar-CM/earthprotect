export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { updateShopItem } from '@/app/actions/shop'
import { ShopItemForm } from '../../_components/ShopItemForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function EditShopItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const item = await prisma.shopItem.findUnique({ where: { id } })
  if (!item) notFound()

  const action = updateShopItem.bind(null, id)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/shop" className="flex items-center gap-1.5 text-sm hover:opacity-70 transition-opacity" style={{ color: 'var(--ep-muted)' }}>
          <ArrowLeft size={15} /> Back
        </Link>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}>
          Edit Shop Item
        </h1>
      </div>
      <ShopItemForm
        action={action}
        defaultValues={{
          slug: item.slug,
          name: item.name,
          description: item.description,
          price: item.price,
          imageUrl: item.imageUrl,
          category: item.category,
          tags: item.tags,
          inStock: item.inStock,
          proceedsNote: item.proceedsNote,
          published: item.published,
        }}
      />
    </div>
  )
}
