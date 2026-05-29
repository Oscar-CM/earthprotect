'use client'

import Link from 'next/link'
import { ShoppingCart, Check } from 'lucide-react'
import { useState } from 'react'
import { useShopStore } from '@/store/shopStore'
import type { ShopItem } from '@/types'

interface ShopItemCardProps {
  item: ShopItem
}

export function ShopItemCard({ item }: ShopItemCardProps) {
  const addItem = useShopStore((s) => s.addItem)
  const [added, setAdded] = useState(false)

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault()
    addItem(item)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div
      className="group rounded-xl overflow-hidden flex flex-col hover:-translate-y-1 transition-all duration-300"
      style={{
        background: 'var(--ep-card)',
        border: '1px solid var(--ep-border)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      }}
    >
      {/* Clickable image → product detail */}
      <Link href={`/shop/${item.slug}`} className="relative overflow-hidden h-52 block">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url(${item.imageUrl})` }}
        />
        {/* Hover overlay */}
        <div
          className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          style={{ background: 'rgba(0,0,0,0.15)' }}
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span
            className="px-3 py-1.5 rounded-full text-xs font-semibold text-white backdrop-blur-sm"
            style={{ background: 'rgba(45,106,79,0.85)' }}
          >
            View Details →
          </span>
        </div>
        {!item.inStock && (
          <div
            className="absolute inset-0 flex items-center justify-center text-sm font-bold"
            style={{ background: 'rgba(0,0,0,0.5)', color: 'white' }}
          >
            Out of Stock
          </div>
        )}
        <div
          className="absolute top-2 right-2 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full"
          style={{ background: 'var(--ep-primary)', color: 'white' }}
        >
          {item.category}
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <Link href={`/shop/${item.slug}`}>
          <h3
            className="font-bold text-sm mb-1 hover:opacity-70 transition-opacity"
            style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}
          >
            {item.name}
          </h3>
        </Link>
        <p className="text-xs leading-relaxed line-clamp-2 flex-1 mb-2" style={{ color: 'var(--ep-muted)' }}>
          {item.description}
        </p>
        <p className="text-[11px] italic mb-3" style={{ color: 'var(--ep-secondary)' }}>
          {item.proceedsNote}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold" style={{ color: 'var(--ep-primary)' }}>
            ${item.price}
          </span>
          <button
            onClick={handleAdd}
            disabled={!item.inStock || added}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white transition-all duration-200 hover:opacity-90 disabled:opacity-60"
            style={{ background: added ? 'var(--ep-secondary)' : 'var(--ep-primary)' }}
          >
            {added ? (
              <><Check size={13} /> Added</>
            ) : (
              <><ShoppingCart size={13} /> Add to Cart</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
