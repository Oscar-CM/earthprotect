import type { ConservationStatus } from '@/types'

interface ConservationBadgeProps {
  status: ConservationStatus
  size?: 'sm' | 'md' | 'lg'
}

const STATUS_COLORS: Record<ConservationStatus, string> = {
  'Extinct': 'var(--ep-extinct)',
  'Extinct in the Wild': 'var(--ep-extinct)',
  'Critically Endangered': 'var(--ep-critical)',
  'Endangered': 'var(--ep-endangered)',
  'Vulnerable': 'var(--ep-vulnerable)',
  'Near Threatened': 'var(--ep-near-threatened)',
  'Least Concern': 'var(--ep-least-concern)',
}

const SIZE_CLASSES = {
  sm: 'text-[10px] px-2 py-0.5',
  md: 'text-xs px-2.5 py-1',
  lg: 'text-sm px-3 py-1.5',
}

export function ConservationBadge({ status, size = 'md' }: ConservationBadgeProps) {
  const color = STATUS_COLORS[status]
  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ${SIZE_CLASSES[size]}`}
      style={{
        background: `color-mix(in srgb, ${color} 15%, transparent)`,
        color,
        border: `1px solid color-mix(in srgb, ${color} 30%, transparent)`,
      }}
    >
      {status}
    </span>
  )
}
