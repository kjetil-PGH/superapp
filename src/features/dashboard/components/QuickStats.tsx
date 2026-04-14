import { MetricCard } from '@/components/ui/MetricCard'
import { formatNOK } from '@/lib/format'
import type { RecurringSummary } from '@/types/domain'

interface QuickStatsProps {
  summary: RecurringSummary
}

export function QuickStats({ summary }: QuickStatsProps) {
  const topCategory = summary.categories[0]
  const potentialSaving = summary.insights
    .filter(i => i.potentialMonthlySaving)
    .reduce((s, i) => s + (i.potentialMonthlySaving ?? 0), 0)

  return (
    <div className="grid grid-cols-2 gap-2.5 mx-4 mb-4">
      <MetricCard
        label="Faste utgifter"
        value={formatNOK(summary.totalMonthly)}
        sub="per måned"
      />
      <MetricCard
        label="Mulig besparelse"
        value={formatNOK(potentialSaving)}
        sub="per måned"
        valueColor="text-ok"
      />
      <MetricCard
        label="Størst kategori"
        value={topCategory?.label ?? '–'}
        sub={topCategory ? formatNOK(topCategory.monthlyTotal) + '/mnd' : undefined}
      />
      <MetricCard
        label="Antall abonnementer"
        value={String(summary.expenseCount)}
        sub={`${summary.categories.length} kategorier`}
      />
    </div>
  )
}
