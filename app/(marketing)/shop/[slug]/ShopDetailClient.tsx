'use client'

import { useState, useTransition } from 'react'
import { ShoppingCart, Check, Loader2, Minus, Plus } from 'lucide-react'
import { useShopStore } from '@/store/shopStore'
import { createShopCheckout } from '@/app/actions/stripe'
import type { ShopItem } from '@/types'

export function ShopDetailClient({ item }: { item: ShopItem }) {
  const addItem = useShopStore((s) => s.addItem)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleAddToCart() {
    addItem(item, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  function handleBuyNow() {
    const cartItems = [{ item, quantity: qty }]
    startTransition(() => {
      createShopCheckout(cartItems).catch(() => {})
    })
  }

  return (
    <div className="space-y-4">
      {/* Quantity selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium" style={{ color: 'var(--ep-text)' }}>Quantity</span>
        <div
          className="flex items-center rounded-xl overflow-hidden"
          style={{ border: '1px solid var(--ep-border)' }}
        >
          <button
            onClick={() => setQty(q => Math.max(1, q - 1))}
            className="w-10 h-10 flex items-center justify-center hover:opacity-70 transition-opacity"
            style={{ color: 'var(--ep-muted)' }}
          >
            <Minus size={15} />
          </button>
          <span
            className="w-12 text-center text-sm font-semibold"
            style={{ color: 'var(--ep-text)' }}
          >
            {qty}
          </span>
          <button
            onClick={() => setQty(q => q + 1)}
            className="w-10 h-10 flex items-center justify-center hover:opacity-70 transition-opacity"
            style={{ color: 'var(--ep-muted)' }}
          >
            <Plus size={15} />
          </button>
        </div>
        <span className="text-sm font-bold" style={{ color: 'var(--ep-primary)' }}>
          ${(item.price * qty).toFixed(2)}
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleAddToCart}
          disabled={!item.inStock || added}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90 disabled:opacity-60"
          style={{
            background: added ? 'var(--ep-secondary)' : 'transparent',
            color: added ? 'white' : 'var(--ep-primary)',
            border: `2px solid ${added ? 'var(--ep-secondary)' : 'var(--ep-primary)'}`,
          }}
        >
          {added ? <><Check size={16} /> Added to Cart</> : <><ShoppingCart size={16} /> Add to Cart</>}
        </button>

        <button
          onClick={handleBuyNow}
          disabled={!item.inStock || isPending}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 disabled:opacity-60"
          style={{ background: 'var(--ep-primary)' }}
        >
          {isPending ? <><Loader2 size={16} className="animate-spin" /> Processing…</> : 'Buy Now'}
        </button>
      </div>
    </div>
  )
}
