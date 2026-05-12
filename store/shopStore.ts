import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ShopItem, CartItem } from '@/types'

interface ShopState {
  items: CartItem[]
  addItem: (item: ShopItem, quantity?: number) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  totalItems: () => number
  totalPrice: () => number
}

export const useShopStore = create<ShopState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((ci) => ci.item.id === item.id)
          if (existing) {
            return {
              items: state.items.map((ci) =>
                ci.item.id === item.id
                  ? { ...ci, quantity: ci.quantity + quantity }
                  : ci
              ),
            }
          }
          return { items: [...state.items, { item, quantity }] }
        }),

      removeItem: (itemId) =>
        set((state) => ({
          items: state.items.filter((ci) => ci.item.id !== itemId),
        })),

      updateQuantity: (itemId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((ci) => ci.item.id !== itemId)
              : state.items.map((ci) =>
                  ci.item.id === itemId ? { ...ci, quantity } : ci
                ),
        })),

      clearCart: () => set({ items: [] }),

      totalItems: () =>
        get().items.reduce((sum, ci) => sum + ci.quantity, 0),

      totalPrice: () =>
        get().items.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0),
    }),
    { name: 'earth-protect-shop-cart' }
  )
)
