'use client'

import { useState } from 'react'
import { Link2, Check, Share2 } from 'lucide-react'

interface SocialShareProps {
  url: string
  title: string
  description?: string
}

const platforms = [
  {
    id: 'twitter',
    label: 'X / Twitter',
    bg: '#000000',
    hover: '#222222',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.63L18.245 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    getUrl: (url: string, title: string) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}&hashtags=EarthProtect,WildlifeConservation`,
  },
  {
    id: 'facebook',
    label: 'Facebook',
    bg: '#1877f2',
    hover: '#0d65e0',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    getUrl: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    bg: '#25d366',
    hover: '#1ebe5d',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
    getUrl: (url: string, title: string) =>
      `https://wa.me/?text=${encodeURIComponent(`${title}\n\n${url}`)}`,
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    bg: '#0a66c2',
    hover: '#0859a8',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    getUrl: (url: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    id: 'telegram',
    label: 'Telegram',
    bg: '#229ed9',
    hover: '#1a8fc4',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
    getUrl: (url: string, title: string) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    bg: '#010101',
    hover: '#1a1a1a',
    copyOnly: true,
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.67a8.18 8.18 0 004.77 1.52V6.74a4.84 4.84 0 01-1-.05z" />
      </svg>
    ),
  },
  {
    id: 'instagram',
    label: 'Instagram',
    bg: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
    hover: 'linear-gradient(135deg, #e08828 0%, #d55d34 25%, #cb2139 50%, #bb1f5d 75%, #ac1480 100%)',
    copyOnly: true,
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
]

export function SocialShare({ url, title, description }: SocialShareProps) {
  const [copied, setCopied] = useState(false)
  const [appCopied, setAppCopied] = useState<string | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)

  async function handleNativeShare() {
    if (navigator.share) {
      await navigator.share({ title, text: description ?? title, url })
    }
  }

  function copyLink() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  function copyForApp(appId: string) {
    const text = appId === 'tiktok'
      ? `${title} 🐾 #EarthProtect #WildlifeConservation\n\n${url}`
      : `${title}\n\n${url}`
    navigator.clipboard.writeText(text).then(() => {
      setAppCopied(appId)
      setTimeout(() => setAppCopied(null), 2500)
    })
  }

  const hasNativeShare = typeof navigator !== 'undefined' && !!navigator.share

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--ep-muted)' }}>
          Share this
        </p>
        {hasNativeShare && (
          <button
            onClick={handleNativeShare}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-all hover:opacity-80 sm:hidden"
            style={{ background: 'var(--ep-primary)', color: 'white' }}
          >
            <Share2 size={13} /> Share
          </button>
        )}
      </div>

      {/* Platform grid — 4 cols on mobile, 8 on sm+ */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
        {platforms.map((p) => {
          const isHovered = hovered === p.id
          const isCopyApp = p.copyOnly
          const wasCopied = appCopied === p.id

          if (isCopyApp) {
            return (
              <button
                key={p.id}
                onClick={() => copyForApp(p.id)}
                onMouseEnter={() => setHovered(p.id)}
                onMouseLeave={() => setHovered(null)}
                title={p.id === 'tiktok' ? 'Copy for TikTok' : 'Copy link for Instagram'}
                className="flex flex-col items-center gap-1 py-3 px-1 rounded-xl text-white transition-all duration-200 relative overflow-hidden"
                style={{
                  background: isHovered ? (p.hover as string) : (p.bg as string),
                  transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                  boxShadow: isHovered ? '0 6px 16px rgba(0,0,0,0.2)' : '0 2px 6px rgba(0,0,0,0.1)',
                }}
              >
                {wasCopied ? <Check size={20} /> : p.icon}
                <span className="text-[10px] font-semibold leading-tight">
                  {wasCopied ? 'Copied!' : p.label}
                </span>
              </button>
            )
          }

          return (
            <a
              key={p.id}
              href={(p as { getUrl: (url: string, title: string) => string }).getUrl(url, title)}
              target="_blank"
              rel="noopener noreferrer"
              title={`Share on ${p.label}`}
              onMouseEnter={() => setHovered(p.id)}
              onMouseLeave={() => setHovered(null)}
              className="flex flex-col items-center gap-1 py-3 px-1 rounded-xl text-white transition-all duration-200 no-underline"
              style={{
                background: isHovered ? (p.hover as string) : (p.bg as string),
                transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                boxShadow: isHovered ? '0 6px 16px rgba(0,0,0,0.2)' : '0 2px 6px rgba(0,0,0,0.1)',
              }}
            >
              {p.icon}
              <span className="text-[10px] font-semibold leading-tight">{p.label}</span>
            </a>
          )
        })}

        {/* Copy link */}
        <button
          onClick={copyLink}
          onMouseEnter={() => setHovered('copy')}
          onMouseLeave={() => setHovered(null)}
          title="Copy link"
          className="flex flex-col items-center gap-1 py-3 px-1 rounded-xl transition-all duration-200"
          style={{
            background: hovered === 'copy' ? 'var(--ep-bg2)' : 'var(--ep-card)',
            border: '1px solid var(--ep-border)',
            color: copied ? '#059669' : 'var(--ep-text)',
            transform: hovered === 'copy' ? 'translateY(-2px)' : 'translateY(0)',
            boxShadow: hovered === 'copy' ? '0 6px 16px rgba(0,0,0,0.08)' : '0 2px 6px rgba(0,0,0,0.04)',
          }}
        >
          {copied ? <Check size={20} style={{ color: '#059669' }} /> : <Link2 size={20} />}
          <span className="text-[10px] font-semibold leading-tight">
            {copied ? 'Copied!' : 'Copy Link'}
          </span>
        </button>
      </div>

      {appCopied && (
        <p className="text-xs text-center" style={{ color: 'var(--ep-muted)' }}>
          {appCopied === 'tiktok'
            ? '✓ Caption + link copied — paste in your TikTok video description!'
            : '✓ Link copied — paste it in your Instagram bio or story link!'}
        </p>
      )}
    </div>
  )
}
