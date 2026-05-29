import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

type Ad = {
  id: string
  slug: string
  title: string
  description: string | null
  imageUrl: string | null
  linkUrl: string | null
  linkText: string | null
  type: string
  htmlContent: string | null
  active: boolean
}

interface AdBlockProps {
  ad: Ad
}

export function AdBlock({ ad }: AdBlockProps) {
  if (!ad.active) return null

  if (ad.htmlContent) {
    return (
      <div
        className="my-6 rounded-xl overflow-hidden"
        dangerouslySetInnerHTML={{ __html: ad.htmlContent }}
      />
    )
  }

  if (ad.type === 'banner') {
    return (
      <div
        className="my-6 rounded-xl overflow-hidden relative"
        style={{ border: '1px solid var(--ep-border)' }}
      >
        {ad.imageUrl && (
          <img src={ad.imageUrl} alt={ad.title} className="w-full h-40 object-cover" />
        )}
        <div
          className="p-4 flex items-center justify-between gap-4"
          style={{ background: 'var(--ep-card)' }}
        >
          <div>
            <p className="font-semibold text-sm" style={{ color: 'var(--ep-text)' }}>{ad.title}</p>
            {ad.description && (
              <p className="text-xs mt-0.5" style={{ color: 'var(--ep-muted)' }}>{ad.description}</p>
            )}
          </div>
          {ad.linkUrl && (
            <a
              href={ad.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg text-white transition-opacity hover:opacity-80"
              style={{ background: 'var(--ep-primary)' }}
            >
              {ad.linkText ?? 'Learn More'}
              <ExternalLink size={13} />
            </a>
          )}
        </div>
        <span
          className="absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded"
          style={{ background: 'rgba(0,0,0,0.5)', color: 'rgba(255,255,255,0.7)' }}
        >
          AD
        </span>
      </div>
    )
  }

  // inline / sidebar
  return (
    <div
      className="my-6 p-4 rounded-xl flex gap-4 items-center"
      style={{ background: 'var(--ep-card)', border: '1px solid var(--ep-border)' }}
    >
      {ad.imageUrl && (
        <img
          src={ad.imageUrl}
          alt={ad.title}
          className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
        />
      )}
      <div className="flex-1 min-w-0">
        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--ep-muted)' }}>
          Sponsored
        </span>
        <p className="font-semibold text-sm mt-0.5" style={{ color: 'var(--ep-text)' }}>{ad.title}</p>
        {ad.description && (
          <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--ep-muted)' }}>{ad.description}</p>
        )}
        {ad.linkUrl && (
          <a
            href={ad.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold mt-2 hover:opacity-70 transition-opacity"
            style={{ color: 'var(--ep-primary)' }}
          >
            {ad.linkText ?? 'Learn More'} <ExternalLink size={11} />
          </a>
        )}
      </div>
    </div>
  )
}
