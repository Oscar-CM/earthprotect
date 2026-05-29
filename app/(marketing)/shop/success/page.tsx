export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { ShoppingBag, Heart, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { handleShopSuccess } from '@/app/actions/checkout'

export const metadata = { title: 'Order Confirmed — Thank You!' }

export default async function ShopSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams
  const data = session_id ? await handleShopSuccess(session_id) : null

  return (
    <div className="min-h-screen pt-24 flex items-center justify-center px-6" style={{ background: 'var(--ep-bg)' }}>
      <div className="text-center max-w-lg">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: 'color-mix(in srgb, var(--ep-primary) 15%, transparent)' }}
        >
          <ShoppingBag size={36} style={{ color: 'var(--ep-primary)' }} />
        </div>

        <h1
          className="text-3xl font-bold mb-3"
          style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}
        >
          {data?.name ? `Order confirmed, ${data.name.split(' ')[0]}!` : 'Order Confirmed!'}
        </h1>

        {data && (
          <div
            className="my-5 p-5 rounded-xl text-left space-y-3"
            style={{ background: 'var(--ep-card)', border: '1px solid var(--ep-border)' }}
          >
            <p className="text-sm font-semibold mb-1" style={{ color: 'var(--ep-text)' }}>Order Summary</p>

            {data.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span style={{ color: 'var(--ep-muted)' }}>
                  {item.name} ×{item.quantity}
                </span>
                <span className="font-medium" style={{ color: 'var(--ep-text)' }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}

            <div
              className="flex justify-between text-sm font-bold pt-2"
              style={{ borderTop: '1px solid var(--ep-border)', color: 'var(--ep-text)' }}
            >
              <span>Total</span>
              <span style={{ color: 'var(--ep-primary)' }}>${data.amount.toFixed(2)}</span>
            </div>

            {data.shippingAddress && (
              <div className="pt-2" style={{ borderTop: '1px solid var(--ep-border)' }}>
                <p className="text-xs font-semibold flex items-center gap-1 mb-1" style={{ color: 'var(--ep-muted)' }}>
                  <MapPin size={11} /> Shipping to
                </p>
                <p className="text-sm" style={{ color: 'var(--ep-text)' }}>
                  {data.shippingAddress.line1}
                  {data.shippingAddress.line2 ? `, ${data.shippingAddress.line2}` : ''}
                </p>
                <p className="text-sm" style={{ color: 'var(--ep-text)' }}>
                  {data.shippingAddress.city}, {data.shippingAddress.state} {data.shippingAddress.postalCode}
                </p>
                <p className="text-sm" style={{ color: 'var(--ep-muted)' }}>
                  {data.shippingAddress.country}
                </p>
              </div>
            )}

            {data.email && (
              <p className="text-xs" style={{ color: 'var(--ep-muted)' }}>
                Confirmation sent to <strong>{data.email}</strong>
              </p>
            )}
          </div>
        )}

        <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--ep-muted)' }}>
          Your purchase directly supports African wildlife conservation — wear it with pride.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/shop">
            <Button variant="outline" style={{ borderColor: 'var(--ep-border)', color: 'var(--ep-text)' }}>
              Continue Shopping
            </Button>
          </Link>
          <Link href="/adopt">
            <Button className="gap-2 text-white" style={{ background: 'var(--ep-primary)', border: 'none' }}>
              <Heart size={16} /> Adopt an Animal
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
