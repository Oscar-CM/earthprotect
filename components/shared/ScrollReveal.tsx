'use client'

import { useScrollReveal } from '@/hooks/useScrollReveal'

interface ScrollRevealProps {
  children: React.ReactNode
  threshold?: number
  className?: string
  id?: string
}

export function ScrollReveal({ children, threshold = 0.12, className = '', id }: ScrollRevealProps) {
  const ref = useScrollReveal<HTMLDivElement>(threshold)
  return (
    <div ref={ref} className={className} id={id}>
      {children}
    </div>
  )
}
