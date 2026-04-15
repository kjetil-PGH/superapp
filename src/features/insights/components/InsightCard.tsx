import { useNavigate } from 'react-router-dom'
import type { Insight } from '@/types/domain'
import { formatNOK } from '@/lib/format'
import { MerchantLogo, MerchantLogoGroup } from '@/components/ui/MerchantLogo'

interface InsightCardProps {
  insight: Insight
}

const typeIcons: Record<string, string> = {
  saving_opportunity: '💡',
  price_increase: '📈',
  unused_subscription: '❓',
  category_summary: '📊',
  trend: '📉',
}

const iconBg: Record<string, string> = {
  critical: 'bg-err-bg',
  warning: 'bg-warn-bg',
  info: 'bg-ok-bg',
}

const severityBg: Record<string, string> = {
  critical: 'bg-err-bg',
  warning: 'bg-warn-bg',
  info: 'bg-surface',
}

export function InsightCard({ insight }: InsightCardProps) {
  const navigate = useNavigate()

  const logo = insight.merchantNames && insight.merchantNames.length > 1 ? (
    <MerchantLogoGroup names={insight.merchantNames} size={40} />
  ) : insight.merchantName ? (
    <MerchantLogo name={insight.merchantName} size={40} />
  ) : (
    <div className={`w-10 h-10 rounded-xl ${iconBg[insight.severity]} flex items-center justify-center text-lg shrink-0`}>
      {typeIcons[insight.type]}
    </div>
  )

  return (
    <div
      className={`${severityBg[insight.severity]} rounded-[20px] shadow-sm shadow-black/4 overflow-hidden cursor-pointer active:scale-[0.99] transition-transform mb-2.5`}
      onClick={() => {
        if (insight.relatedExpenseId) navigate(`/recurring/${insight.relatedExpenseId}`)
      }}
    >
      <div className="flex items-start gap-3 p-4">
        {logo}
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
