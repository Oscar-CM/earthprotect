'use client'

import { useState, useMemo, useTransition, useEffect } from 'react'
import { ShoppingCart, X, Plus, Minus, Loader2 } from 'lucide-react'
import { SectionTitle } from '@/components/shared/SectionTitle'
import { ShopItemCard } from '@/components/cards/ShopItemCard'
import { Button } from '@/components/ui/button'
import { useShopStore } from '@/store/shopStore'
import { createShopCheckout } from '@/app/actions/stripe'
import { SHOP_ITEMS } from '@/lib/constants'
import type { ShopItem } from '@/types'

type Category = 'all' | 'apparel' | 'prints' | 'accessories' | 'digital'

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'all', label: 'All Products' },
  { value: 'apparel', label: 'Apparel' },
  { value: 'prints', label: 'Art Prints' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'digital', label: 'Digital' },
]

export function ShopClient({ dbItems = [] }: { dbItems?: ShopItem[] }) {
  const [category, setCategory] = useState<Category>('all')
  const [cartOpen, setCartOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [hydrated, setHydrated] = useState(false)

  const { items, removeItem, updateQuantity, totalItems, totalPrice } = useShopStore()

  useEffect(() => { setHydrated(true) }, [])

  // DB items take precedence; static items fill the rest
  const allItems = useMemo(() => {
    const dbSlugs = new Set(dbItems.map((i) => i.slug))
    return [...dbItems, ...SHOP_ITEMS.filter((i) => !dbSlugs.has(i.slug))]
  }, [dbItems])

  const filtered = useMemo(
    () => category === 'all' ? allItems : allItems.filter((i) => i.category === category),
    [category, allItems]
  )

  function handleCheckout() {
    startTransition(() => {
      createShopCheckout(items).catch(() => {})
    })
  }

  return (
    <div className="min-h-screen pt-24" style={{ background: 'var(--ep-bg)' }}>
      {/* Header */}
      <div className="py-16 px-6 text-center" style={{ background: 'var(--ep-bg2)', borderBottom: '1px solid var(--ep-border)' }}>
        <div className="max-w-2xl mx-auto">
          <SectionTitle
            accent="Conservation Shop"
            title="Shop for the Wild"
            subtitle="Every purchase directly supports African wildlife conservation. Wear your values, gift with purpose."
            centered
          />
        </div>
      </div>

      {/* Sticky toolbar */}
      <div
        className="sticky top-[72px] z-30 px-6 py-3 flex items-center gap-3 flex-wrap"
        style={{
          background: 'color-mix(in srgb, var(--ep-bg) 90%, transparent)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--ep-border)',
        }}
      >
        <div className="flex gap-2 flex-wrap flex-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className="text-xs font-semibold px-3 py-1.5 rounded-full transition-all"
              style={{
                background: category === cat.value ? 'var(--ep-primary)' : 'var(--ep-card)',
                color: category === cat.value ? 'white' : 'var(--ep-muted)',
                border: `1px solid ${category === cat.value ? 'var(--ep-primary)' : 'var(--ep-border)'}`,
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setCartOpen(true)}
          className="relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all"
          style={{ background: 'var(--ep-primary)', color: 'white', border: 'none' }}
        >
          <ShoppingCart size={16} />
          Cart
          {hydrated && totalItems() > 0 && (
            <span
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center"
              style={{ background: 'var(--ep-secondary)', color: 'white' }}
            >
              {totalItems()}
            </span>
          )}
        </button>
      </div>

      {/* Product grid */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((item) => (
            <ShopItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* Cart sidebar */}
      {cartOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setCartOpen(false)}
          />
          <div
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm flex flex-col"
            style={{ background: 'var(--ep-bg)', borderLeft: '1px solid var(--ep-border)' }}
          >
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: '1px solid var(--ep-border)' }}
            >
              <h2 className="font-bold text-lg" style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}>
                Your Cart ({totalItems()})
              </h2>
              <button onClick={() => setCartOpen(false)}>
                <X size={20} style={{ color: 'var(--ep-muted)' }} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {items.length === 0 ? (
                <p className="text-center text-sm py-10" style={{ color: 'var(--ep-muted)' }}>
                  Your cart is empty.
                </p>
              ) : (
                items.map((ci) => (
                  <div
                    key={ci.item.id}
                    className="flex gap-3 pb-4"
                    style={{ borderBottom: '1px solid var(--ep-border)' }}
                  >
                    <div
                      className="w-16 h-16 rounded-lg bg-cover bg-center flex-shrink-0"
                      style={{ backgroundImage: `url(${ci.item.imageUrl})` }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate" style={{ color: 'var(--ep-text)' }}>
                        {ci.item.name}
                      </p>
                      <p className="text-sm font-bold mt-0.5" style={{ color: 'var(--ep-primary)' }}>
                        ${ci.item.price}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(ci.item.id, ci.quantity - 1)}
                          className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ background: 'var(--ep-bg2)', color: 'var(--ep-text)' }}
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-sm font-medium" style={{ color: 'var(--ep-text)' }}>{ci.quantity}</span>
                        <button
                          onClick={() => updateQuantity(ci.item.id, ci.quantity + 1)}
                          className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ background: 'var(--ep-bg2)', color: 'var(--ep-text)' }}
                        >
                          <Plus size={12} />
                        </button>
                        <button
                          onClick={() => removeItem(ci.item.id)}
                          className="ml-auto"
                          style={{ color: 'var(--ep-muted)' }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="px-5 py-4" style={{ borderTop: '1px solid var(--ep-border)' }}>
                <div className="flex justify-between text-sm mb-3">
                  <span style={{ color: 'var(--ep-muted)' }}>Total</span>
                  <span className="font-bold text-lg" style={{ color: 'var(--ep-text)' }}>
                    ${totalPrice().toFixed(2)}
                  </span>
                </div>
                <Button
                  onClick={handleCheckout}
                  disabled={isPending}
                  className="w-full text-white font-semibold gap-2"
                  style={{ background: 'var(--ep-primary)', border: 'none' }}
                >
                  {isPending
                    ? <><Loader2 size={16} className="animate-spin" /> Processing…</>
                    : <>Checkout · ${totalPrice().toFixed(2)}</>}
                </Button>
                <p className="text-[11px] text-center mt-2" style={{ color: 'var(--ep-muted)' }}>
                  Secure checkout via Stripe
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
