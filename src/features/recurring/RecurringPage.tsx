import { useMemo, useState } from 'react'
import { useTransactions } from '@/lib/useTransactions'
import { detectRecurring } from '@/lib/recurring-detection'
import { buildRecurringSummary } from '@/lib/insights'
import { formatNOK } from '@/lib/format'
import { TopNav } from '@/components/layout/TopNav'
import { SectionHeader } from '@/components/layout/SectionHeader'
import { MetricCard } from '@/components/ui/MetricCard'
import { SubscriptionItem } from './components/SubscriptionItem'
import { ConnectBankPrompt } from '@/components/ui/ConnectBankPrompt'
import type { ExpenseCategory } from '@/types/domain'

const filterOptions: { key: ExpenseCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'Alle' },
  { key: 'streaming', label: 'Streaming' },
  { key: 'software', label: 'Programvare' },
  { key: 'telecom', label: 'Telekom' },
  { key: 'fitness', label: 'Trening' },
  { key: 'music', label: 'Musikk' },
  { key: 'other', label: 'Annet' },
]

export function RecurringPage() {
  const [filter, setFilter] = useState<ExpenseCategory | 'all'>('all')
  const { transactions, loading, connected } = useTransactions()

  const summary = useMemo(() => {
    const expenses = detectRecurring(transactions)
    return buildRecurringSummary(expenses)
  }, [transactions])

  const filtered = filter === 'all'
    ? summary.expenses
    : summary.expenses.filter(e => e.category === filter)

  return (
    <div className="pb-4">
      <TopNav title="Faste utgifter" />

      {!connected ? (
        <ConnectBankPrompt description="Koble til banken din for å se faste utgifter og abonnementer." />
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
          <div className="grid grid-cols-2 gap-2.5 mx-4 mb-4">
            <MetricCard
              label="Totalt per måned"
              value={formatNOK(summary.totalMonthly)}
            />
            <MetricCard
              label="Totalt per år"
              value={formatNOK(summary.totalYearly)}
              valueColor="text-ink"
            />
          </div>

          <div className="flex gap-2 px-4 mb-4 flex-wrap">
            {filterOptions.map(opt => (
              <button
                key={opt.key}
                onClick={() => setFilter(opt.key)}
                className={`text-sm font-semibold px-4 py-1.5 rounded-full transition-colors ${
                  filter === opt.key
                    ? 'bg-ink text-white'
                    : 'bg-surface text-ink-3 shadow-sm shadow-black/[0.04]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <SectionHeader title={`${filtered.length} abonnementer`} />

          <div className="mx-4 bg-surface rounded-[20px] shadow-sm shadow-black/[0.04] overflow-hidden">
            {filtered.map((exp, i) => (
              <SubscriptionItem
                key={exp.id}
                expense={exp}
                showBorder={i < filtered.length - 1}
              />
            ))}
            {filtered.length === 0 && (
              <div className="px-4 py-8 text-center text-ink-3 text-sm">
                Ingen abonnementer i denne kategorien
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
