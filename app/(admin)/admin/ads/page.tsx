export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { deleteAd, toggleAdActive } from '@/app/actions/ads'
import { Plus, Pencil, Trash2, Zap, ZapOff } from 'lucide-react'

type AdRow = {
  id: string; slug: string; title: string; type: string; active: boolean; createdAt: Date
}

export default async function AdminAdsPage() {
  let ads: AdRow[] = []
  try {
    const { prisma } = await import('@/lib/prisma')
    ads = await prisma.ad.findMany({ orderBy: { createdAt: 'desc' } }) as AdRow[]
  } catch { /* DB not connected */ }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}>
            Ads
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--ep-muted)' }}>
            {ads.length} ad{ads.length !== 1 ? 's' : ''} · embed in blog posts using <code className="text-xs px-1 py-0.5 rounded" style={{ background: 'var(--ep-bg2)', color: 'var(--ep-primary)' }}>{'{{ad:slug}}'}</code>
          </p>
        </div>
        <Link href="/admin/ads/new">
          <Button className="flex items-center gap-1.5 text-white" style={{ background: 'var(--ep-primary)', border: 'none' }}>
            <Plus size={16} /> New Ad
          </Button>
        </Link>
      </div>

      {ads.length === 0 ? (
        <div className="p-12 rounded-xl text-center" style={{ background: 'var(--ep-card)', border: '1px solid var(--ep-border)' }}>
          <p className="text-4xl mb-3">📢</p>
          <p className="font-semibold" style={{ color: 'var(--ep-text)' }}>No ads yet</p>
          <p className="text-sm mt-1 mb-4" style={{ color: 'var(--ep-muted)' }}>
            Create ads then embed them anywhere in blog post content using <code className="text-xs">{'{{ad:slug}}'}</code>.
          </p>
          <Link href="/admin/ads/new">
            <Button className="text-white" style={{ background: 'var(--ep-primary)', border: 'none' }}>
              Create first ad
            </Button>
          </Link>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--ep-border)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--ep-bg2)', borderBottom: '1px solid var(--ep-border)' }}>
                {['Title', 'Slug / Shortcode', 'Type', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-semibold" style={{ color: 'var(--ep-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ads.map(ad => (
                <tr key={ad.id} style={{ background: 'var(--ep-card)', borderBottom: '1px solid var(--ep-border)' }}>
                  <td className="px-4 py-3">
                    <p className="font-medium" style={{ color: 'var(--ep-text)' }}>{ad.title}</p>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-xs px-1.5 py-0.5 rounded font-mono" style={{ background: 'var(--ep-bg2)', color: 'var(--ep-primary)' }}>
                      {`{{ad:${ad.slug}}}`}
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary" className="text-xs capitalize">{ad.type}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <form action={async () => { 'use server'; await toggleAdActive(ad.id, !ad.active) }}>
                      <button type="submit" className="flex items-center gap-1 text-xs font-medium hover:opacity-70 transition-opacity" style={{ color: ad.active ? '#059669' : 'var(--ep-muted)' }}>
                        {ad.active ? <><Zap size={13} /> Active</> : <><ZapOff size={13} /> Inactive</>}
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/ads/${ad.id}/edit`}>
                        <button className="p-1.5 rounded hover:opacity-70" style={{ color: 'var(--ep-muted)' }} title="Edit">
                          <Pencil size={14} />
                        </button>
                      </Link>
                      <form action={async () => { 'use server'; await deleteAd(ad.id) }}>
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
