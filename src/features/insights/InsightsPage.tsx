import { useMemo } from 'react'
import { useTransactions } from '@/lib/useTransactions'
import { detectRecurring } from '@/lib/recurring-detection'
import { buildRecurringSummary } from '@/lib/insights'
import { formatNOK } from '@/lib/format'
import { TopNav } from '@/components/layout/TopNav'
import { SectionHeader } from '@/components/layout/SectionHeader'
import { MetricCard } from '@/components/ui/MetricCard'
import { InsightCard } from './components/InsightCard'
import { CategoryBreakdownChart } from './components/CategoryBreakdownChart'
import { ConnectBankPrompt } from '@/components/ui/ConnectBankPrompt'

export function InsightsPage() {
  const { transactions, loading, connected } = useTransactions()

  const summary = useMemo(() => {
    const expenses = detectRecurring(transactions)
    return buildRecurringSummary(expenses)
  }, [transactions])

  const potentialSaving = summary.insights
    .filter(i => i.potentialMonthlySaving)
    .reduce((s, i) => s + (i.potentialMonthlySaving ?? 0), 0)

  return (
    <div className="pb-4">
      <TopNav title="Innsikt" />

      {!connected ? (
        <ConnectBankPrompt description="Koble til banken din for å få innsikt og sparetips basert på transaksjonene dine." />
      ) : loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-3 border-accent/20 border-t-accent rounded-full" />
        </div>
      ) : transactions.length === 0 ? (
        <ConnectBankPrompt
          title="Ingen transaksjoner"
          description="Vi fant ingen transaksjoner. Sjekk at samtykket er fullført."
        />
      ) : (
        <>
          <div className="grid grid-cols-3 gap-2 mx-4 mb-4">
            <MetricCard
              label="Faste/mnd"
              value={formatNOK(summary.totalMonthly)}
            />
            <MetricCard
              label="Faste/år"
              value={formatNOK(summary.totalYearly)}
            />
            <MetricCard
              label="Kan spares"
              value={formatNOK(potentialSaving)}
              valueColor="text-ok"
              sub="/mnd"
            />
          </div>

          <SectionHeader title="Kategorier" />
          <CategoryBreakdownChart categories={summary.categories} />

          <SectionHeader title={`${summary.insights.length} innsikter`} />
          <div className="mx-4">
            {summary.insights.map(insight => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
