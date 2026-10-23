'use client'

import { useState, useTransition, useMemo } from 'react'
import { ShoppingCart, Check, Loader2, Minus, Plus, ExternalLink } from 'lucide-react'
import { useShopStore } from '@/store/shopStore'
import { createShopCheckout } from '@/app/actions/stripe'
import type { ShopItem } from '@/types'

const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN

export function ShopDetailClient({ item }: { item: ShopItem }) {
  const addItem = useShopStore((s) => s.addItem)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [isPending, startTransition] = useTransition()

  const variants = item.variants ?? []
  const optionNames = useMemo(() => {
    const names = new Set<string>()
    variants.forEach((v) => Object.keys(v.options).forEach((k) => names.add(k)))
    return Array.from(names)
  }, [variants])

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(
    () => ({ ...(variants[0]?.options ?? {}) })
  )

  const selectedVariant = useMemo(
    () => variants.find((v) => optionNames.every((n) => v.options[n] === selectedOptions[n])),
    [variants, selectedOptions, optionNames]
  )

  function optionValues(name: string) {
    return Array.from(new Set(variants.map((v) => v.options[name]))).filter(Boolean)
  }

  function isOptionValueAvailable(name: string, value: string) {
    return variants.some(
      (v) =>
        v.options[name] === value &&
        v.available &&
        optionNames
          .filter((n) => n !== name)
          .every((n) => v.options[n] === selectedOptions[n])
    )
  }

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

  const isShopifyProduct = !!item.shopifyId
  const variantPrice = selectedVariant?.price ?? item.price
  const inStock = isShopifyProduct ? (selectedVariant?.available ?? item.inStock) : item.inStock

  const buyOnShopifyUrl = SHOPIFY_DOMAIN
    ? selectedVariant
      ? `https://${SHOPIFY_DOMAIN}/cart/${selectedVariant.id}:${qty}`
      : `https://${SHOPIFY_DOMAIN}/products/${item.slug}`
    : null

  return (
    <div className="space-y-4">
      {/* Variant selectors (size, colour, etc.) */}
      {optionNames.map((name) => (
        <div key={name}>
          <span className="text-sm font-medium block mb-2" style={{ color: 'var(--ep-text)' }}>
            {name}: <span style={{ color: 'var(--ep-muted)' }}>{selectedOptions[name]}</span>
          </span>
          <div className="flex flex-wrap gap-2">
            {optionValues(name).map((value) => {
              const isSelected = selectedOptions[name] === value
              const available = isOptionValueAvailable(name, value)
              return (
                <button
                  key={value}
                  onClick={() => setSelectedOptions((o) => ({ ...o, [name]: value }))}
                  disabled={!available}
                  className="text-sm px-3 py-1.5 rounded-lg font-medium transition-all"
                  style={{
                    border: `2px solid ${isSelected ? 'var(--ep-primary)' : 'var(--ep-border)'}`,
                    color: isSelected ? 'var(--ep-primary)' : available ? 'var(--ep-text)' : 'var(--ep-muted)',
                    background: isSelected ? 'color-mix(in srgb, var(--ep-primary) 8%, transparent)' : 'transparent',
                    opacity: available ? 1 : 0.4,
                    textDecoration: available ? 'none' : 'line-through',
                  }}
                >
                  {value}
                </button>
              )
            })}
          </div>
        </div>
      ))}

      {/* Variant price */}
      {variants.length > 0 && (
        <p className="text-2xl font-bold" style={{ color: 'var(--ep-primary)' }}>
          ${variantPrice.toFixed(2)}
        </p>
      )}

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
          ${(variantPrice * qty).toFixed(2)}
        </span>
      </div>

      {!inStock && (
        <p className="text-sm font-semibold" style={{ color: '#dc2626' }}>
          This option is currently out of stock
        </p>
      )}

      {/* Action buttons */}
      {isShopifyProduct ? (
        <a
          href={inStock ? buyOnShopifyUrl ?? undefined : undefined}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!inStock || !buyOnShopifyUrl}
          className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90"
          style={{
            background: 'var(--ep-primary)',
            pointerEvents: !inStock || !buyOnShopifyUrl ? 'none' : 'auto',
            opacity: !inStock || !buyOnShopifyUrl ? 0.6 : 1,
          }}
        >
          <ExternalLink size={16} /> Buy on Shopify
        </a>
      ) : (
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
      )}

      {isShopifyProduct && (
        <p className="text-xs text-center" style={{ color: 'var(--ep-muted)' }}>
          Opens checkout on our Shopify store in a new tab
        </p>
      )}
    </div>
  )
}
