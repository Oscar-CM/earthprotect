import { ShopClient } from './ShopClient'
import type { ShopItem } from '@/types'

export const metadata = {
  title: 'Gift Shop',
  description: 'Shop Earth Protect merchandise. Every purchase helps fund African wildlife conservation.',
}

async function getDbItems(): Promise<ShopItem[]> {
  try {
    const { prisma } = await import('@/lib/prisma')
    const rows = await prisma.shopItem.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' } })
    return rows.map((r) => ({
      id: r.id, slug: r.slug, name: r.name, description: r.description,
      price: r.price, imageUrl: r.imageUrl,
      category: r.category as ShopItem['category'],
      tags: r.tags, inStock: r.inStock, proceedsNote: r.proceedsNote,
      shopifyId: r.shopifyId,
      images: (r.images as string[] | null) ?? [],
      variants: (r.variants as unknown as ShopItem['variants']) ?? [],
    }))
  } catch { return [] }
}

export default async function ShopPage() {
  const dbItems = await getDbItems()
  return <ShopClient dbItems={dbItems} />
}
