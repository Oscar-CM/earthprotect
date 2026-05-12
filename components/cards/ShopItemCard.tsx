'use client'

import { ShoppingCart, Check } from 'lucide-react'
import { useState } from 'react'
import { useShopStore } from '@/store/shopStore'
import { Button } from '@/components/ui/button'
import type { ShopItem } from '@/types'

interface ShopItemCardProps {
  item: ShopItem
}

export function ShopItemCard({ item }: ShopItemCardProps) {
  const addItem = useShopStore((s) => s.addItem)
  const [added, setAdded] = useState(false)

  function handleAdd() {
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
      <div className="relative overflow-hidden h-52">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url(${item.imageUrl})` }}
        />
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
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3
          className="font-bold text-sm mb-1"
          style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}
        >
          {item.name}
        </h3>
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
          <Button
            size="sm"
            onClick={handleAdd}
            disabled={!item.inStock || added}
            className="gap-1.5 text-white text-xs"
            style={{ background: added ? 'var(--ep-secondary)' : 'var(--ep-primary)', border: 'none' }}
          >
            {added ? (
              <><Check size={13} /> Added</>
            ) : (
              <><ShoppingCart size={13} /> Add to Cart</>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
