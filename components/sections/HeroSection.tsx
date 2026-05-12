import Link from 'next/link'
import { Heart, Users, Leaf, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ paddingTop: '80px' }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1920&q=80)',
        }}
      />
      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.40) 50%, rgba(0,0,0,0.65) 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
        <p
          className="text-sm font-semibold uppercase tracking-widest mb-4 opacity-80"
          style={{ color: '#F4924A' }}
        >
          Protecting Africa&apos;s Wild Heart
        </p>

        <h1
          className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
          style={{ fontFamily: 'var(--font-lora)' }}
        >
          Every Life{' '}
          <span
            className="hero-gradient-text"
          >
            Matters
          </span>
        </h1>

        <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-10 max-w-2xl mx-auto">
          Join us in protecting Africa&apos;s most vulnerable wildlife and habitats.
          Adopt an animal, fund conservation, or become part of our global movement.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/adopt">
            <Button
              size="lg"
              className="gap-2 text-white font-semibold w-full sm:w-auto text-base px-8"
              style={{ background: 'var(--ep-primary)', border: 'none' }}
            >
              <Leaf size={18} />
              Adopt an Animal
            </Button>
          </Link>
          <Link href="/donate">
            <Button
              size="lg"
              className="gap-2 font-semibold w-full sm:w-auto text-base px-8"
              style={{
                background: 'var(--ep-secondary)',
                border: 'none',
                color: 'white',
              }}
            >
              <Heart size={18} />
              Donate Now
            </Button>
          </Link>
          <Link href="/join">
            <Button
              size="lg"
              variant="outline"
              className="gap-2 font-semibold w-full sm:w-auto text-base px-8"
              style={{
                borderColor: 'rgba(255,255,255,0.5)',
                color: 'white',
                background: 'rgba(255,255,255,0.10)',
              }}
            >
              <Users size={18} />
              Join Us
            </Button>
          </Link>
        </div>

        {/* Stats strip */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {[
            { value: '1,200+', label: 'Animals Protected' },
            { value: '850K ha', label: 'Habitat Conserved' },
            { value: '42', label: 'Partner Countries' },
            { value: '18K+', label: 'Global Members' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p
                className="text-2xl md:text-3xl font-bold"
                style={{ fontFamily: 'var(--font-lora)', color: '#F4924A' }}
              >
                {stat.value}
              </p>
              <p className="text-xs text-white/60 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown size={28} className="text-white/50" />
      </div>
    </section>
  )
}
