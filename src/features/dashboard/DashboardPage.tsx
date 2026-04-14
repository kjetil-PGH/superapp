import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTransactions } from '@/lib/useTransactions'
import { detectRecurring } from '@/lib/recurring-detection'
import { buildRecurringSummary } from '@/lib/insights'
import { formatNOK, formatDateShort } from '@/lib/format'
import { SavingsHero } from './components/SavingsHero'
import { QuickStats } from './components/QuickStats'
import { RecommendationCard } from './components/RecommendationCard'
import { TopExpensesList } from './components/TopExpensesList'
import { SectionHeader } from '@/components/layout/SectionHeader'
import { TopNav } from '@/components/layout/TopNav'
import { ConnectBankPrompt } from '@/components/ui/ConnectBankPrompt'
import type { NeonomicsTransaction } from '@/types/neonomics'
import { TransactionLogo } from '@/components/ui/MerchantLogo'

function TransactionOverview({ transactions }: { transactions: NeonomicsTransaction[] }) {
  const debits = transactions.filter(t => t.creditDebitIndicator === 'DBIT')
  const credits = transactions.filter(t => t.creditDebitIndicator === 'CRDT')
  const totalOut = debits.reduce((s, t) => s + parseFloat(t.transactionAmount.value), 0)
  const totalIn = credits.reduce((s, t) => s + parseFloat(t.transactionAmount.value), 0)

  return (
    <div className="grid grid-cols-2 gap-2.5 mx-4 mb-4">
      <div className="bg-surface rounded-2xl p-4 shadow-sm shadow-black/4">
        <div className="text-xs font-semibold text-ink-3 uppercase tracking-wider mb-1">Utgifter</div>
        <div className="text-xl font-bold text-ink">{formatNOK(totalOut)}</div>
        <div className="text-sm text-ink-4 mt-0.5">{debits.length} transaksjoner</div>
      </div>
      <div className="bg-surface rounded-2xl p-4 shadow-sm shadow-black/4">
        <div className="text-xs font-semibold text-ink-3 uppercase tracking-wider mb-1">Inntekter</div>
        <div className="text-xl font-bold text-ok">{formatNOK(totalIn)}</div>
        <div className="text-sm text-ink-4 mt-0.5">{credits.length} transaksjoner</div>
      </div>
    </div>
  )
}

function RecentTransactions({ transactions }: { transactions: NeonomicsTransaction[] }) {
  const navigate = useNavigate()
  const sorted = [...transactions]
    .sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime())
    .slice(0, 10)

  return (
    <div className="mx-4 bg-surface rounded-[20px] shadow-sm shadow-black/4 overflow-hidden">
      {sorted.map((tx, i) => {
        const isDebit = tx.creditDebitIndicator === 'DBIT'
        const name = tx.transactionReference || tx.counterpartyName || 'Ukjent'
        const amount = parseFloat(tx.transactionAmount.value)
        return (
          <div
            key={tx.id}
            className={`flex items-center gap-3 px-4 py-3 ${i < sorted.length - 1 ? 'border-b border-border' : ''}`}
          >
            <TransactionLogo name={name} isDebit={isDebit} size={36} />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-ink truncate">{name}</div>
              <div className="text-xs text-ink-4">{formatDateShort(tx.bookingDate)}</div>
            </div>
            <div className={`text-sm font-bold flex-shrink-0 ${isDebit ? 'text-ink' : 'text-ok'}`}>
              {isDebit ? '−' : '+'}{formatNOK(amount)}
            </div>
          </div>
        )
      })}
      {sorted.length === 0 && (
        <div className="px-4 py-8 text-center text-ink-3 text-sm">Ingen transaksjoner ennå</div>
      )}
    </div>
  )
}

export function DashboardPage() {
  const navigate = useNavigate()
  const { transactions, loading, connected } = useTransactions()

  const summary = useMemo(() => {
    const expenses = detectRecurring(transactions)
    return buildRecurringSummary(expenses)
  }, [transactions])

  const topInsights = summary.insights.slice(0, 3)
  const hasRecurring = summary.expenseCount > 0

  return (
    <div className="pb-4">
      <TopNav title="Oversikt" />

      {!connected ? (
        <ConnectBankPrompt />
      ) : loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-3 border-accent/20 border-t-accent rounded-full" />
        </div>
      ) : (
        <>
          <SectionHeader title={new Date().toLocaleDateString('nb-NO', { month: 'long', year: 'numeric' }).replace(/^\w/, c => c.toUpperCase())} />

          <TransactionOverview transactions={transactions} />

          {hasRecurring && (
            <>
              <SavingsHero
                totalMonthly={summary.totalMonthly}
                totalYearly={summary.totalYearly}
                expenseCount={summary.expenseCount}
              />

              <QuickStats summary={summary} />

              {topInsights.length > 0 && (
                <>
                  <SectionHeader title="Anbefalinger" action="Se alle" onAction={() => navigate('/insights')} />
                  <div className="mx-4">
                    {topInsights.map(insight => (
                      <RecommendationCard key={insight.id} insight={insight} />
                    ))}
                  </div>
                </>
              )}

              <SectionHeader
                title="Dyreste abonnementer"
                action="Se alle"
                onAction={() => navigate('/recurring')}
              />
              <TopExpensesList expenses={summary.expenses} limit={5} />
            </>
          )}

          <SectionHeader title="Siste transaksjoner" />
          <RecentTransactions transactions={transactions} />
        </>
      )}
    </div>
  )
}
