import { useNavigate } from 'react-router-dom'
import type { Insight } from '@/types/domain'
import { formatNOK } from '@/lib/format'

interface InsightCardProps {
  insight: Insight
}

export function InsightCard({ insight }: InsightCardProps) {
  const navigate = useNavigate()

  const icons = {
    saving_opportunity: '💡',
    price_increase: '📈',
    unused_subscription: '❓',
    category_summary: '📊',
    trend: '📉',
  }

  const severityBg = {
    critical: 'bg-err-bg',
    warning: 'bg-warn-bg',
    info: 'bg-surface',
  }

  const iconBg = {
    critical: 'bg-err-bg',
    warning: 'bg-warn-bg',
    info: 'bg-ok-bg',
  }

  return (
    <div
      className={`${severityBg[insight.severity]} rounded-[20px] shadow-sm shadow-black/[0.04] overflow-hidden cursor-pointer active:scale-[0.99] transition-transform mb-2.5`}
      onClick={() => {
        if (insight.relatedExpenseId) navigate(`/recurring/${insight.relatedExpenseId}`)
      }}
    >
      <div className="flex items-start gap-3 p-4">
        <div className={`w-10 h-10 rounded-[12px] ${iconBg[insight.severity]} flex items-center justify-center text-lg flex-shrink-0`}>
          {icons[insight.type]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-base font-bold text-ink mb-1">{insight.title}</div>
          <div className="text-sm text-ink-3 leading-relaxed">{insight.description}</div>
          {insight.potentialYearlySaving && (
            <div className="text-sm font-bold text-ok mt-2">
              Mulig besparelse: {formatNOK(insight.potentialYearlySaving)}/år
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
