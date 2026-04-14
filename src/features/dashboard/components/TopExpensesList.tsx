import { useNavigate } from 'react-router-dom'
import type { RecurringExpense } from '@/types/domain'
import { formatNOK } from '@/lib/format'
import { ConfidenceBadge } from '@/components/ui/Badge'
import { categoryLabel } from '@/lib/format'
import { MerchantLogo } from '@/components/ui/MerchantLogo'

interface TopExpensesListProps {
  expenses: RecurringExpense[]
  limit?: number
}

export function TopExpensesList({ expenses, limit = 5 }: TopExpensesListProps) {
  const navigate = useNavigate()
  const top = expenses.slice(0, limit)

  return (
    <div className="mx-4 bg-surface rounded-[20px] shadow-sm shadow-black/[0.04] overflow-hidden">
      {top.map((exp, i) => (
        <div
          key={exp.id}
          className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer active:bg-surface-2 transition-colors ${i < top.length - 1 ? 'border-b border-border' : ''}`}
          onClick={() => navigate(`/recurring/${exp.id}`)}
        >
          <MerchantLogo name={exp.merchant} size={40} />
          <div className="flex-1 min-w-0">
            <div className="text-base font-semibold text-ink">{exp.merchant}</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-sm text-ink-3">{categoryLabel(exp.category)}</span>
              <ConfidenceBadge confidence={exp.confidence} />
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-base font-bold text-ink">{formatNOK(exp.monthlyAmount)}</div>
            <div className="text-xs text-ink-3">/mnd</div>
          </div>
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" className="flex-shrink-0">
            <path d="M5 3l4 4-4 4" stroke="#BFBFBF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      ))}
    </div>
  )
}
