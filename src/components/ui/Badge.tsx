import type { Confidence } from '@/types/domain'
import { confidenceLabel, confidenceColor } from '@/lib/confidence'

interface BadgeProps {
  confidence: Confidence
}

export function ConfidenceBadge({ confidence }: BadgeProps) {
  const { bg, text, dot } = confidenceColor(confidence)
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${bg} ${text}`}>
      <span className={`w-[5px] h-[5px] rounded-full ${dot}`} />
      {confidenceLabel(confidence)}
    </span>
  )
}

interface TrendBadgeProps {
  trend: 'stable' | 'increasing' | 'decreasing'
}

export function TrendBadge({ trend }: TrendBadgeProps) {
  const config = {
    stable: { label: 'Stabil', className: 'bg-surface-3 text-ink-3' },
    increasing: { label: '↑ Øker', className: 'bg-warn-bg text-warn' },
    decreasing: { label: '↓ Synker', className: 'bg-ok-bg text-ok' },
  }
  const { label, className } = config[trend]
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${className}`}>
      {label}
    </span>
  )
}

interface CategoryBadgeProps {
  label: string
  variant?: 'default' | 'accent'
}

export function CategoryBadge({ label, variant = 'default' }: CategoryBadgeProps) {
  const cls = variant === 'accent'
    ? 'bg-accent-light text-accent-dark'
    : 'bg-surface-3 text-ink-3'
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      {label}
    </span>
  )
}
