'use client'

import { useEffect, useRef, useState } from 'react'

interface ProgressBarProps {
  current: number
  goal: number
  label?: string
  colorVar?: string
  showAmounts?: boolean
}

function formatCurrency(n: number) {
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`
  return `$${n}`
}

export function ProgressBar({
  current,
  goal,
  label,
  colorVar = 'var(--ep-primary)',
  showAmounts = true,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.round((current / goal) * 100))
  const [animated, setAnimated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setAnimated(true); observer.disconnect() } },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="w-full">
      {(label || showAmounts) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <span className="text-xs font-medium" style={{ color: 'var(--ep-muted)' }}>
              {label}
            </span>
          )}
          {showAmounts && (
            <span className="text-xs font-semibold ml-auto" style={{ color: 'var(--ep-text)' }}>
              {formatCurrency(current)} / {formatCurrency(goal)}
            </span>
          )}
        </div>
      )}
      <div
        className="w-full h-2.5 rounded-full overflow-hidden"
        style={{ background: 'var(--ep-bg2)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: animated ? `${pct}%` : '0%',
            background: colorVar,
          }}
        />
      </div>
      <p className="text-[11px] mt-1" style={{ color: 'var(--ep-muted)' }}>
        {pct}% funded
      </p>
    </div>
  )
}
