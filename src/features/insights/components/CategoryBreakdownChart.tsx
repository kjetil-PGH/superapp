import type { CategoryBreakdown } from '@/types/domain'
import { formatNOK } from '@/lib/format'
import { ProgressBar } from '@/components/ui/ProgressBar'

interface CategoryBreakdownChartProps {
  categories: CategoryBreakdown[]
}

export function CategoryBreakdownChart({ categories }: CategoryBreakdownChartProps) {
  const maxMonthly = Math.max(...categories.map(c => c.monthlyTotal), 1)

  return (
    <div className="mx-4 bg-surface rounded-[20px] shadow-sm shadow-black/[0.04] overflow-hidden">
      {categories.map((cat, i) => (
        <div
          key={cat.category}
          className={`px-4 py-3.5 ${i < categories.length - 1 ? 'border-b border-border' : ''}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-ink">{cat.label}</span>
            <span className="text-sm font-bold text-ink">{formatNOK(cat.monthlyTotal)}/mnd</span>
          </div>
          <ProgressBar
            value={cat.monthlyTotal}
            max={maxMonthly}
            variant={cat.percentage > 40 ? 'warn' : 'accent'}
            height={4}
          />
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-xs text-ink-3">{cat.count} tjeneste{cat.count !== 1 ? 'r' : ''}</span>
            <span className="text-xs text-ink-3">{cat.percentage}% av totalt</span>
          </div>
        </div>
      ))}
    </div>
  )
}
