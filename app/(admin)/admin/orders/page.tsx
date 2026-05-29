export const dynamic = 'force-dynamic'

import { Badge } from '@/components/ui/badge'
import { ShoppingBag, Mail, MapPin } from 'lucide-react'

type ShippingAddress = {
  name?: string; line1?: string; line2?: string
  city?: string; state?: string; postalCode?: string; country?: string
}

type Order = {
  id: string; customerName: string | null; customerEmail: string
  phone: string | null; shippingAddress: ShippingAddress | null
  items: Array<{ name: string; quantity: number; price: number }>
  total: number; fulfilled: boolean; createdAt: Date
}

export default async function AdminOrdersPage() {
  let orders: Order[] = []
  try {
    const { prisma } = await import('@/lib/prisma')
    orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } }) as unknown as Order[]
  } catch {
    // DB not connected
  }

  const revenue = orders.reduce((sum, o) => sum + o.total, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1
          className="text-2xl font-bold"
          style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}
        >
          Shop Orders
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--ep-muted)' }}>
          {orders.length} order{orders.length !== 1 ? 's' : ''} · ${revenue.toLocaleString()} total revenue
        </p>
      </div>

      {orders.length === 0 ? (
        <div
          className="p-12 rounded-xl text-center"
          style={{ background: 'var(--ep-card)', border: '1px solid var(--ep-border)' }}
        >
          <ShoppingBag size={36} className="mx-auto mb-3" style={{ color: 'var(--ep-muted)' }} />
          <p className="font-semibold" style={{ color: 'var(--ep-text)' }}>No orders yet</p>
          <p className="text-sm mt-1" style={{ color: 'var(--ep-muted)' }}>
            Shop orders will appear here after checkout.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-5 rounded-xl"
              style={{ background: 'var(--ep-card)', border: '1px solid var(--ep-border)' }}
            >
              <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                <div>
                  <p className="font-semibold" style={{ color: 'var(--ep-text)' }}>
                    {order.customerName ?? 'Customer'}
                  </p>
                  <a
                    href={`mailto:${order.customerEmail}`}
                    className="flex items-center gap-1 text-sm hover:opacity-70 transition-opacity"
                    style={{ color: 'var(--ep-primary)' }}
                  >
                    <Mail size={12} /> {order.customerEmail}
                  </a>
                  {order.phone && (
                    <p className="text-xs mt-0.5" style={{ color: 'var(--ep-muted)' }}>{order.phone}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold" style={{ color: 'var(--ep-primary)' }}>${order.total}</p>
                  <p className="text-xs" style={{ color: 'var(--ep-muted)' }}>
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div
                className="text-sm space-y-1 mb-3 p-3 rounded-lg"
                style={{ background: 'var(--ep-bg2)' }}
              >
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between">
                    <span style={{ color: 'var(--ep-text)' }}>{item.name} ×{item.quantity}</span>
                    <span style={{ color: 'var(--ep-muted)' }}>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Shipping */}
              {order.shippingAddress && (
                <div className="text-xs flex items-start gap-1.5" style={{ color: 'var(--ep-muted)' }}>
                  <MapPin size={12} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--ep-primary)' }} />
                  <span>
                    {order.shippingAddress.line1}
                    {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ''},{' '}
                    {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                    {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                  </span>
                </div>
              )}

              {/* Fulfil toggle */}
              <div className="mt-3 flex items-center justify-end">
                <Badge
                  className="text-xs"
                  style={
                    order.fulfilled
                      ? { background: '#dcfce7', color: '#166534' }
                      : { background: '#fef9c3', color: '#854d0e' }
                  }
                >
                  {order.fulfilled ? 'Fulfilled' : 'Pending fulfilment'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
