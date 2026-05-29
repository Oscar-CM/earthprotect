'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sun, Moon, Menu, X, Heart, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/context/ThemeContext'
import { useShopStore } from '@/store/shopStore'
import { NAV_LINKS } from '@/lib/constants'
import { EarthProtectIcon } from '@/components/shared/EarthProtectLogo'

export function Navbar() {
  const pathname = usePathname() ?? ''
  const { theme, toggleTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const totalItems = useShopStore((s) => s.totalItems())

  useEffect(() => { setHydrated(true) }, [])

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 20) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function closeMenu() { setIsMenuOpen(false) }

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center gap-6 px-6 py-4"
      style={{
        background: 'color-mix(in srgb, var(--ep-bg) 85%, transparent)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--ep-border)',
        boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.10)' : 'none',
        transition: 'box-shadow 0.25s ease',
      }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 font-bold text-lg mr-auto">
        <EarthProtectIcon size={30} />
        <span style={{ color: 'var(--ep-text)', fontFamily: 'var(--font-lora)' }}>
          Earth<span style={{ color: 'var(--ep-primary)' }}>Protect</span>
        </span>
      </Link>

      {/* Desktop nav links */}
      <ul className="hidden md:flex gap-6 list-none items-center">
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + '/')
          return (
            <li key={link.label}>
              <Link
                href={link.href}
                className="text-sm font-medium transition-colors duration-200"
                style={{ color: isActive ? 'var(--ep-primary)' : 'var(--ep-muted)' }}
              >
                {link.label}
              </Link>
            </li>
          )
        })}
      </ul>

      {/* Cart icon */}
      <Link href="/shop" className="relative hidden md:flex">
        <ShoppingBag size={20} style={{ color: 'var(--ep-muted)' }} />
        {hydrated && totalItems > 0 && (
          <span
            className="absolute -top-2 -right-2 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
            style={{ background: 'var(--ep-primary)' }}
          >
            {totalItems}
          </span>
        )}
      </Link>

      {/* Donate CTA */}
      <Link href="/donate" className="hidden md:block">
        <Button
          size="sm"
          className="gap-1.5 text-white font-semibold"
          style={{ background: 'var(--ep-primary)', border: 'none' }}
        >
          <Heart size={14} />
          Donate
        </Button>
      </Link>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200"
        style={{ background: 'var(--ep-bg2)', border: '1px solid var(--ep-border)' }}
      >
        {theme === 'dark'
          ? <Sun size={16} style={{ color: 'var(--ep-muted)' }} />
          : <Moon size={16} style={{ color: 'var(--ep-muted)' }} />}
      </button>

      {/* Hamburger */}
      <button
        className="md:hidden"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
        style={{ color: 'var(--ep-text)' }}
      >
        {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div
          className="absolute top-full left-0 right-0 flex flex-col gap-1 px-4 py-4 md:hidden"
          style={{ background: 'var(--ep-bg2)', borderBottom: '1px solid var(--ep-border)' }}
        >
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={closeMenu}
                className="text-sm font-medium px-3 py-2 rounded-md transition-colors"
                style={{
                  color: isActive ? 'var(--ep-primary)' : 'var(--ep-muted)',
                  background: isActive ? 'color-mix(in srgb, var(--ep-primary) 10%, transparent)' : 'transparent',
                }}
              >
                {link.label}
              </Link>
            )
          })}
          <Link href="/donate" onClick={closeMenu} className="mt-2">
            <Button
              size="sm"
              className="w-full gap-1.5 text-white font-semibold"
              style={{ background: 'var(--ep-primary)', border: 'none' }}
            >
              <Heart size={14} />
              Donate Now
            </Button>
          </Link>
        </div>
      )}
    </nav>
  )
}
