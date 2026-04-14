import { useNavigate } from 'react-router-dom'
import type { RecurringExpense } from '@/types/domain'
import { formatNOK } from '@/lib/format'
import { ConfidenceBadge, TrendBadge } from '@/components/ui/Badge'
import { categoryLabel } from '@/lib/format'
import { MerchantLogo } from '@/components/ui/MerchantLogo'

interface SubscriptionItemProps {
  expense: RecurringExpense
  showBorder?: boolean
}

export function SubscriptionItem({ expense, showBorder = true }: SubscriptionItemProps) {
  const navigate = useNavigate()

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer active:bg-surface-2 transition-colors ${showBorder ? 'border-b border-border' : ''}`}
      onClick={() => navigate(`/recurring/${expense.id}`)}
    >
      <MerchantLogo name={expense.merchant} size={40} />
      <div className="flex-1 min-w-0">
        <div className="text-base font-semibold text-ink">{expense.merchant}</div>
        <div className="text-sm text-ink-3 mt-0.5">{categoryLabel(expense.category)}</div>
        <div className="flex items-center gap-1.5 mt-1">
          <ConfidenceBadge confidence={expense.confidence} />
          {expense.trend !== 'stable' && <TrendBadge trend={expense.trend} />}
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="text-base font-bold text-ink">{formatNOK(expense.monthlyAmount)}</div>
        <div className="text-xs text-ink-3">{formatNOK(expense.yearlyAmount)}/år</div>
      </div>
      <svg width="12" height="12" viewBox="0 0 14 14" fill="none" className="flex-shrink-0">
        <path d="M5 3l4 4-4 4" stroke="#BFBFBF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}
