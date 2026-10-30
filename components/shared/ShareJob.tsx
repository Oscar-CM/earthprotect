'use client'

import { useEffect, useState } from 'react'
import { Check, Link2, Mail, Send, Share2 } from 'lucide-react'

interface ShareJobProps {
  /** Absolute URL of the opening, e.g. https://masterwriters.org/careers?job=abc */
  url: string
  title: string
}

const NETWORKS = (url: string, text: string) => [
  { name: 'WhatsApp', href: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`, bg: '#25D366' },
  { name: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, bg: '#0A66C2' },
  { name: 'X', href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, bg: '#111111' },
  { name: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, bg: '#1877F2' },
  { name: 'Telegram', href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, bg: '#229ED9' },
]

export function ShareJob({ url, title }: ShareJobProps) {
  const [copied, setCopied] = useState(false)
  const [canNativeShare, setCanNativeShare] = useState(false)
  useEffect(() => setCanNativeShare(typeof navigator.share === 'function'), [])
  const text = `${title} · Earth Protect is hiring`

  async function copy() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt('Copy this link', url)
    }
  }

  async function nativeShare() {
    try {
      await navigator.share({ title, text, url })
    } catch {
      /* dismissed */
    }
  }

  const pill = 'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-85'

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label={`Share ${title}`}>
      <span className="inline-flex items-center gap-1 text-xs font-medium" style={{ color: 'var(--ep-muted)' }}>
        <Share2 size={13} /> Share this job
      </span>
      {NETWORKS(url, text).map((n) => (
        <a key={n.name} href={n.href} target="_blank" rel="noopener noreferrer" className={pill} style={{ background: n.bg }}>
          {n.name}
        </a>
      ))}
      <a
        href={`mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(`${text}\n\n${url}`)}`}
        className={pill}
        style={{ background: 'var(--ep-muted)' }}
      >
        <Mail size={12} /> Email
      </a>
      <button type="button" onClick={copy} className={pill} style={{ background: 'var(--ep-primary)' }}>
        {copied ? <Check size={12} /> : <Link2 size={12} />} {copied ? 'Copied' : 'Copy link'}
      </button>
      {canNativeShare && (
        <button type="button" onClick={nativeShare} className={pill} style={{ background: 'var(--ep-accent)' }}>
          <Send size={12} /> More…
        </button>
      )}
    </div>
  )
}
