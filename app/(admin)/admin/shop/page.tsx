export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { deleteShopItem, toggleShopItemPublished } from '@/app/actions/shop'
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'

type ShopItemRow = {
  id: string; slug: string; name: string; category: string
  price: number; inStock: boolean; published: boolean; imageUrl: string
}

export default async function AdminShopPage() {
  let items: ShopItemRow[] = []
  try {
    const { prisma } = await import('@/lib/prisma')
    items = await prisma.shopItem.findMany({ orderBy: { createdAt: 'desc' } }) as ShopItemRow[]
  } catch { /* DB not connected */ }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}>
            Shop Items
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--ep-muted)' }}>
            {items.length} item{items.length !== 1 ? 's' : ''} in the shop
          </p>
        </div>
        <Link href="/admin/shop/new">
          <Button className="flex items-center gap-1.5 text-white" style={{ background: 'var(--ep-primary)', border: 'none' }}>
            <Plus size={16} /> Add Item
          </Button>
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="p-12 rounded-xl text-center" style={{ background: 'var(--ep-card)', border: '1px solid var(--ep-border)' }}>
          <p className="text-4xl mb-3">🛍️</p>
          <p className="font-semibold" style={{ color: 'var(--ep-text)' }}>No shop items yet</p>
          <p className="text-sm mt-1 mb-4" style={{ color: 'var(--ep-muted)' }}>
            Add products for visitors to buy and support conservation.
          </p>
          <Link href="/admin/shop/new">
            <Button className="text-white" style={{ background: 'var(--ep-primary)', border: 'none' }}>
              Add first item
            </Button>
          </Link>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--ep-border)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--ep-bg2)', borderBottom: '1px solid var(--ep-border)' }}>
                {['Item', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-semibold" style={{ color: 'var(--ep-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} style={{ background: 'var(--ep-card)', borderBottom: '1px solid var(--ep-border)' }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {item.imageUrl && (
                        <img src={item.imageUrl} alt={item.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                      )}
                      <div>
                        <p className="font-medium" style={{ color: 'var(--ep-text)' }}>{item.name}</p>
                        <p className="text-xs" style={{ color: 'var(--ep-muted)' }}>/{item.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary" className="text-xs capitalize">{item.category}</Badge>
                  </td>
                  <td className="px-4 py-3 font-semibold" style={{ color: 'var(--ep-primary)' }}>
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium" style={{ color: item.inStock ? '#059669' : '#dc2626' }}>
                      {item.inStock ? 'In stock' : 'Out of stock'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <form action={async () => { 'use server'; await toggleShopItemPublished(item.id, !item.published) }}>
                      <button type="submit" className="flex items-center gap-1 text-xs font-medium hover:opacity-70 transition-opacity" style={{ color: item.published ? '#059669' : 'var(--ep-muted)' }}>
                        {item.published ? <><Eye size={13} /> Live</> : <><EyeOff size={13} /> Hidden</>}
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/shop/${item.id}/edit`}>
                        <button className="p-1.5 rounded hover:opacity-70" style={{ color: 'var(--ep-muted)' }} title="Edit">
                          <Pencil size={14} />
                        </button>
                      </Link>
                      <form action={async () => { 'use server'; await deleteShopItem(item.id) }}>
                        <button type="submit" className="p-1.5 rounded hover:opacity-70" style={{ color: '#dc2626' }} title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
