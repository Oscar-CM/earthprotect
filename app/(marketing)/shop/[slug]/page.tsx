export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ShoppingCart, Leaf, ChevronRight, Tag } from 'lucide-react'
import { SHOP_ITEMS } from '@/lib/constants'
import type { ShopItem } from '@/types'
import { ShopDetailClient } from './ShopDetailClient'

async function getItem(slug: string): Promise<ShopItem | null> {
  try {
    const { prisma } = await import('@/lib/prisma')
    const r = await prisma.shopItem.findUnique({ where: { slug, published: true } })
    if (r) {
      return {
        id: r.id, slug: r.slug, name: r.name, description: r.description,
        price: r.price, imageUrl: r.imageUrl,
        category: r.category as ShopItem['category'],
        tags: r.tags, inStock: r.inStock, proceedsNote: r.proceedsNote,
      }
    }
  } catch { /* fall through */ }
  return SHOP_ITEMS.find((i) => i.slug === slug) ?? null
}

async function getRelated(item: ShopItem): Promise<ShopItem[]> {
  const staticRelated = SHOP_ITEMS.filter((i) => i.slug !== item.slug && i.category === item.category).slice(0, 4)
  try {
    const { prisma } = await import('@/lib/prisma')
    const dbItems = await prisma.shopItem.findMany({
      where: { published: true, category: item.category, NOT: { slug: item.slug } },
      take: 4,
    })
    const dbMapped: ShopItem[] = dbItems.map((r) => ({
      id: r.id, slug: r.slug, name: r.name, description: r.description,
      price: r.price, imageUrl: r.imageUrl,
      category: r.category as ShopItem['category'],
      tags: r.tags, inStock: r.inStock, proceedsNote: r.proceedsNote,
    }))
    const all = [...dbMapped, ...staticRelated.filter((s) => !dbMapped.some((d) => d.slug === s.slug))]
    return all.slice(0, 4)
  } catch { return staticRelated }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const item = await getItem(slug)
  if (!item) return {}
  return {
    title: `${item.name} — Earth Protect Shop`,
    description: item.description,
    openGraph: {
      title: item.name,
      description: item.description,
      images: [{ url: item.imageUrl, width: 600, height: 600, alt: item.name }],
    },
    twitter: { card: 'summary_large_image', title: item.name, description: item.description, images: [item.imageUrl] },
  }
}

export default async function ShopItemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [item, related] = await Promise.all([getItem(slug), getItem(slug).then((i) => i ? getRelated(i) : [])])
  if (!item) notFound()

  return (
    <div className="min-h-screen pt-20" style={{ background: 'var(--ep-bg)' }}>
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs mb-8" style={{ color: 'var(--ep-muted)' }}>
          <Link href="/" className="hover:opacity-70">Home</Link>
          <ChevronRight size={12} />
          <Link href="/shop" className="hover:opacity-70">Shop</Link>
          <ChevronRight size={12} />
          <span className="capitalize" style={{ color: 'var(--ep-text)' }}>{item.name}</span>
        </nav>

        {/* Main product layout */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Image */}
          <div className="space-y-4">
            <div
              className="w-full aspect-square rounded-2xl overflow-hidden shadow-lg"
              style={{ border: '1px solid var(--ep-border)' }}
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            {!item.inStock && (
              <div
                className="p-3 rounded-xl text-center text-sm font-semibold"
                style={{ background: '#fee2e2', color: '#dc2626' }}
              >
                This item is currently out of stock
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            {/* Category + tags */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span
                className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full text-white"
                style={{ background: 'var(--ep-primary)' }}
              >
                {item.category}
              </span>
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full capitalize"
                  style={{ background: 'var(--ep-bg2)', color: 'var(--ep-muted)', border: '1px solid var(--ep-border)' }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1
              className="text-3xl md:text-4xl font-bold mb-3 leading-tight"
              style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}
            >
              {item.name}
            </h1>

            <p className="text-4xl font-bold mb-6" style={{ color: 'var(--ep-primary)' }}>
              ${item.price.toFixed(2)}
            </p>

            <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--ep-muted)' }}>
              {item.description}
            </p>

            {/* Conservation impact */}
            <div
              className="flex items-start gap-3 p-4 rounded-xl mb-6"
              style={{ background: 'color-mix(in srgb, var(--ep-primary) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--ep-primary) 20%, transparent)' }}
            >
              <Leaf size={20} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--ep-primary)' }} />
              <div>
                <p className="text-sm font-semibold mb-0.5" style={{ color: 'var(--ep-text)' }}>Conservation Impact</p>
                <p className="text-sm" style={{ color: 'var(--ep-muted)' }}>{item.proceedsNote}</p>
              </div>
            </div>

            {/* Add to cart — client island */}
            <ShopDetailClient item={item} />

            <p className="text-xs text-center mt-4" style={{ color: 'var(--ep-muted)' }}>
              Secure checkout via Stripe · Free returns within 30 days
            </p>

            <div className="mt-6 pt-6" style={{ borderTop: '1px solid var(--ep-border)' }}>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity"
                style={{ color: 'var(--ep-primary)' }}
              >
                <ArrowLeft size={15} /> Back to shop
              </Link>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div>
            <h2
              className="text-2xl font-bold mb-6"
              style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}
            >
              More from the shop
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.map((r) => (
                <Link key={r.slug} href={`/shop/${r.slug}`} className="group block">
                  <div
                    className="rounded-xl overflow-hidden hover:-translate-y-1 transition-all duration-300"
                    style={{ border: '1px solid var(--ep-border)', background: 'var(--ep-card)' }}
                  >
                    <div className="relative overflow-hidden h-40">
                      <img
                        src={r.imageUrl}
                        alt={r.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-3">
                      <p className="font-semibold text-sm truncate" style={{ color: 'var(--ep-text)' }}>{r.name}</p>
                      <p className="text-sm font-bold mt-0.5" style={{ color: 'var(--ep-primary)' }}>${r.price.toFixed(2)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
