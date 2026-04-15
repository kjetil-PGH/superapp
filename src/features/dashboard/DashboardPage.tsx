import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTransactions } from '@/lib/useTransactions'
import { detectRecurring } from '@/lib/recurring-detection'
import { buildRecurringSummary } from '@/lib/insights'
import { formatNOK, formatDateShort } from '@/lib/format'
import { TopNav } from '@/components/layout/TopNav'
import { SectionHeader } from '@/components/layout/SectionHeader'
import { ConnectBankPrompt } from '@/components/ui/ConnectBankPrompt'
import { TransactionLogo } from '@/components/ui/MerchantLogo'
import { ActionCard } from '@/components/ui/ActionCard'
import { goals } from '@/data/goals-data'
import { TopExpensesList } from './components/TopExpensesList'
import type { NeonomicsTransaction } from '@/types/neonomics'

type MetricTab = 'spart' | 'tilovers' | 'potensial'

const chartLines: Record<MetricTab, number[]> = {
  spart: [2000, 4500, 6200, 8500, 10800, 14200],
  tilovers: [5000, 8000, 12000, 16000, 20000, 23400],
  potensial: [1200, 2100, 3400, 4200, 5000, 5800],
}

const tabConfig: { key: MetricTab; label: string; value: string; suffix: string }[] = [
  { key: 'spart', label: 'Spart', value: '14 200', suffix: 'kr' },
  { key: 'tilovers', label: 'Til overs', value: '23 400', suffix: 'kr' },
  { key: 'potensial', label: 'Potensial', value: '5 800', suffix: 'kr/mnd' },
]

const lineStyles: Record<MetricTab, { color: string }> = {
  spart: { color: 'var(--color-accent, #1565C0)' },
  tilovers: { color: 'var(--color-ok, #2E7D32)' },
  potensial: { color: 'var(--color-warn, #E65100)' },
}

const CHART_W = 280
const CHART_H = 100
const CHART_MAX = 25000

function toPath(data: number[]): string {
  return data
    .map((v, i) => {
      const x = 16 + (i / (data.length - 1)) * (CHART_W - 32)
      const y = CHART_H - 12 - (v / CHART_MAX) * (CHART_H - 24)
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
}

function SavingsChart({ activeTab }: { activeTab: MetricTab }) {
  const keys: MetricTab[] = ['tilovers', 'spart', 'potensial']

  return (
    <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} className="w-full h-[120px]">
      {keys.map(key => (
        <path
          key={key}
          d={toPath(chartLines[key])}
          fill="none"
          stroke={lineStyles[key].color}
          strokeWidth={activeTab === key ? 2.5 : 1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={activeTab === key ? 1 : 0.2}
          className="transition-all duration-300"
        />
      ))}
    </svg>
  )
}

function RecentTransactions({ transactions }: { transactions: NeonomicsTransaction[] }) {
  const sorted = [...transactions]
    .sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime())
    .slice(0, 10)

  return (
    <div className="mx-4 bg-surface rounded-2 shadow-sm shadow-black/4 overflow-hidden">
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
            <div className={`text-sm font-bold shrink-0 ${isDebit ? 'text-ink' : 'text-ok'}`}>
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
  const [activeTab, setActiveTab] = useState<MetricTab>('spart')

  const summary = useMemo(() => {
    const expenses = detectRecurring(transactions)
    return buildRecurringSummary(expenses)
  }, [transactions])

  const totalCredits = useMemo(
    () =>
      transactions
        .filter(t => t.creditDebitIndicator === 'CRDT')
        .reduce((s, t) => s + parseFloat(t.transactionAmount.value), 0),
    [transactions],
  )

  const potentialSaving = useMemo(
    () => summary.insights.reduce((s, i) => s + (i.potentialMonthlySaving ?? 0), 0),
    [summary.insights],
  )

  const activeMetric = tabConfig.find(t => t.key === activeTab)!

  return (
    <div className="pb-4">
      <TopNav title="Hjem" />

      {!connected ? (
        <ConnectBankPrompt />
      ) : loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-3 border-accent/20 border-t-accent rounded-full" />
        </div>
      ) : (
        <>
          <div className="bg-surface rounded-3xl mx-4 mb-4 p-5 shadow-sm shadow-black/4">
            <SavingsChart activeTab={activeTab} />

            <div className="flex gap-1 mt-4 mb-5 bg-surface-2 rounded-full p-1">
              {tabConfig.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
                    activeTab === tab.key
                      ? 'bg-surface text-ink shadow-sm shadow-black/6'
                      : 'text-ink-3'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="text-center pb-1">
              <span className="text-4xl font-bold text-ink tracking-tight">
                {activeMetric.value}
              </span>
              <span className="text-base text-ink-3 ml-1.5">{activeMetric.suffix}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 mx-4 mb-4">
            <button
              onClick={() => navigate('/economy/formue')}
              className="bg-surface rounded-2xl p-4 shadow-sm shadow-black/4 text-left active:scale-[0.98] transition-transform"
            >
              <div className="text-xs font-semibold text-ink-3 uppercase tracking-wider mb-1">Netto formue</div>
              <div className="text-xl font-bold text-ink">3,2 mill kr</div>
            </button>
            <div className="bg-surface rounded-2xl p-4 shadow-sm shadow-black/4">
              <div className="text-xs font-semibold text-ink-3 uppercase tracking-wider mb-1">Til overs</div>
              <div className="text-xl font-bold text-ok">23 400 kr</div>
            </div>
            <div className="bg-surface rounded-2xl p-4 shadow-sm shadow-black/4">
              <div className="text-xs font-semibold text-ink-3 uppercase tracking-wider mb-1">Innbetalt</div>
              <div className="text-xl font-bold text-ink">{formatNOK(totalCredits)}</div>
            </div>
            <div className="bg-surface rounded-2xl p-4 shadow-sm shadow-black/4">
              <div className="text-xs font-semibold text-ink-3 uppercase tracking-wider mb-1">Du kan spare</div>
              <div className="text-xl font-bold text-accent">
                {potentialSaving.toLocaleString('nb-NO')} kr
                <span className="text-sm font-normal text-ink-3">/mnd</span>
              </div>
            </div>
          </div>

          <div className="mx-4 space-y-3 mb-4">
            <ActionCard
              category="Lån & gjeld"
              categoryColor="err"
              savingsAmount="2 050 kr"
              savingsUnit="/mnd"
              description="Du har forbrukslån til 18,9 % og boliglån til 5,8 %. Samle alt i ett lån til 4,6 %."
              badges={[
                { variant: 'effect-high' },
                { variant: 'effort-low' },
                { variant: 'data-confirmed' },
              ]}
              ctaLabel="Se samlelån"
              featured
              onClick={() => navigate('/economy/lan/samlelan')}
            />
            <ActionCard
              category="Forsikring"
              categoryColor="warn"
              savingsAmount="290 kr"
              savingsUnit="/mnd"
              description="Reiseforsikring i Gjensidige overlapper med forsikring i Visa Infinite."
              badges={[
                { variant: 'effect-medium' },
                { variant: 'data-document' },
              ]}
              ctaLabel="Se forsikring"
              onClick={() => navigate('/economy/forsikring')}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {goals.map(goal => {
              const pct = Math.round((goal.current / goal.target) * 100)
              return (
                <button
                  key={goal.id}
                  onClick={() => navigate('/economy/sparemal')}
                  className="flex items-center gap-2 px-3.5 py-2 bg-surface rounded-full border border-border shadow-sm shadow-black/4 whitespace-nowrap shrink-0 active:scale-[0.97] transition-transform"
                >
                  <span className="text-base">{goal.icon}</span>
                  <span className="text-sm font-medium text-ink">{goal.name}</span>
                  <span className="text-xs font-bold text-accent">{pct}%</span>
                </button>
              )
            })}
          </div>

          <SectionHeader
            title="Dyreste abonnementer"
            action="Se alle"
            onAction={() => navigate('/recurring')}
          />
          <TopExpensesList expenses={summary.expenses} limit={5} />

          <SectionHeader title="Siste transaksjoner" />
          <RecentTransactions transactions={transactions} />
        </>
      )}
    </div>
  )
}
