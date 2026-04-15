import { EpistemiskBadge } from './EpistemiskBadge'
import { DataSourceTag } from './DataSourceTag'
import type { ComponentProps } from 'react'

interface ActionCardProps {
  category: string
  categoryColor?: 'err' | 'warn' | 'accent'
  savingsAmount: string
  savingsUnit?: string
  description: string
  badges?: { variant: ComponentProps<typeof EpistemiskBadge>['variant']; label?: string }[]
  sourceTag?: { variant: 'auto' | 'document' | 'assumed'; label?: string }
  sourceText?: string
  ctaLabel: string
  featured?: boolean
  onClick?: () => void
  onSnooze?: () => void
}

const categoryColors = {
  err: 'text-err',
  warn: 'text-warn',
  accent: 'text-accent',
}

export function ActionCard({
  category,
  categoryColor = 'accent',
  savingsAmount,
  savingsUnit = 'kr/mnd',
  description,
  badges,
  sourceTag,
  sourceText,
  ctaLabel,
  featured,
  onClick,
  onSnooze,
}: ActionCardProps) {
  return (
    <div className="bg-surface rounded-3 border border-border shadow-sm shadow-black/4 overflow-hidden">
      {featured && (
        <div className="bg-accent px-5 py-2.5 flex items-center justify-between">
          <span className="text-xs font-semibold text-white">Viktigst nå</span>
          <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
            {savingsAmount} {savingsUnit}
          </span>
        </div>
      )}

      <div className="p-5 space-y-4">
        <div className="space-y-1">
          <span className={`text-xs font-semibold ${categoryColors[categoryColor]}`}>
            {category}
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-ink">{savingsAmount}</span>
            <span className="text-sm text-ink-3">{savingsUnit}</span>
          </div>
        </div>

        <p className="text-sm text-ink-2 leading-relaxed">{description}</p>

        {badges && badges.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {badges.map((b, i) => (
              <EpistemiskBadge key={i} variant={b.variant} label={b.label} />
            ))}
          </div>
        )}

        {(sourceTag || sourceText) && (
          <div className="flex items-center gap-2">
            {sourceTag && <DataSourceTag variant={sourceTag.variant} label={sourceTag.label} />}
            {sourceText && <span className="text-[10px] text-ink-3">{sourceText}</span>}
          </div>
        )}

        <div className="space-y-2 pt-1">
          <button
            onClick={onClick}
            className="w-full bg-ink text-white rounded-full py-[15px] text-base font-semibold transition-all active:scale-[0.98] shadow-sm"
          >
            {ctaLabel}
          </button>
          {onSnooze && (
            <button
              onClick={onSnooze}
              className="w-full text-center text-sm text-ink-3 py-1.5 active:text-ink-2 transition-colors"
            >
              Ikke nå
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
