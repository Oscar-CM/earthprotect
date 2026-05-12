import Link from 'next/link'
import { Leaf, Mail, Globe, Rss, Video, Users } from 'lucide-react'

const QUICK_LINKS = [
  { label: 'Animals', href: '/animals' },
  { label: 'Regions', href: '/regions' },
  { label: 'Blog', href: '/blog' },
  { label: 'Shop', href: '/shop' },
  { label: 'About', href: '/about' },
]

const ACTION_LINKS = [
  { label: 'Adopt an Animal', href: '/adopt' },
  { label: 'Make a Donation', href: '/donate' },
  { label: 'Join the Community', href: '/join' },
  { label: 'Volunteer', href: '/join' },
  { label: 'Gift Shop', href: '/shop' },
]

const SOCIAL_LINKS = [
  { icon: Globe, label: 'Website', href: '#' },
  { icon: Users, label: 'Community', href: '#' },
  { icon: Rss, label: 'Blog', href: '/blog' },
  { icon: Video, label: 'Videos', href: '#' },
  { icon: Mail, label: 'Email', href: 'mailto:info@earthprotect.org' },
]

export function Footer() {
  return (
    <footer
      className="mt-auto pt-16 pb-8 px-6"
      style={{
        background: 'var(--ep-bg2)',
        borderTop: '1px solid var(--ep-border)',
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Leaf size={24} style={{ color: 'var(--ep-primary)' }} />
              <span
                className="font-bold text-xl"
                style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}
              >
                Earth<span style={{ color: 'var(--ep-primary)' }}>Protect</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--ep-muted)' }}>
              Dedicated to protecting Africa&apos;s extraordinary wildlife and environments.
              Every donation, adoption, and voice matters.
            </p>
            <div className="flex gap-3">
              {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200 hover:opacity-80"
                  style={{ background: 'var(--ep-border)', color: 'var(--ep-muted)' }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3
              className="font-semibold text-sm uppercase tracking-wider mb-4"
              style={{ color: 'var(--ep-accent)' }}
            >
              Explore
            </h3>
            <ul className="space-y-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-200 hover:opacity-80"
                    style={{ color: 'var(--ep-muted)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Take Action */}
          <div>
            <h3
              className="font-semibold text-sm uppercase tracking-wider mb-4"
              style={{ color: 'var(--ep-accent)' }}
            >
              Take Action
            </h3>
            <ul className="space-y-2">
              {ACTION_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-200 hover:opacity-80"
                    style={{ color: 'var(--ep-muted)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs"
          style={{ borderTop: '1px solid var(--ep-border)', color: 'var(--ep-muted)' }}
        >
          <p>© {new Date().getFullYear()} Earth Protect. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:opacity-80">Privacy Policy</Link>
            <Link href="#" className="hover:opacity-80">Terms of Service</Link>
            <Link href="#" className="hover:opacity-80">Charity Registration</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
