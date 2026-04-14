import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTransactions } from '@/lib/useTransactions'
import { detectRecurring } from '@/lib/recurring-detection'
import { formatNOK, formatDateShort, categoryLabel } from '@/lib/format'
import { TopNav } from '@/components/layout/TopNav'
import { Card, CardRow } from '@/components/ui/Card'
import { ConfidenceBadge, TrendBadge } from '@/components/ui/Badge'
import { InfoBox } from '@/components/ui/InfoBox'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { SectionHeader } from '@/components/layout/SectionHeader'
import { MerchantLogo } from '@/components/ui/MerchantLogo'

export function ExpenseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { transactions } = useTransactions()

  const expense = useMemo(() => {
    const all = detectRecurring(transactions)
    return all.find(e => e.id === id)
  }, [id, transactions])

  if (!expense) {
    return (
      <div className="pb-4">
        <TopNav title="Ikke funnet" showBack />
        <div className="px-6 py-12 text-center text-ink-3">
          Fant ikke denne utgiften.
        </div>
      </div>
    )
  }

  const matchingTxs = transactions
    .filter(t => {
      const ref = (t.transactionReference || t.counterpartyName || '').toUpperCase()
      return ref.includes(expense.rawMerchantName.toUpperCase()) ||
        ref.includes(expense.merchant.toUpperCase())
    })
    .sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime())

  return (
    <div className="pb-4">
      <TopNav title={expense.merchant} showBack />

      <div className="mx-4 mb-4 bg-surface rounded-[24px] shadow-sm shadow-black/[0.04] p-5">
        <div className="flex items-center gap-3 mb-4">
          <MerchantLogo name={expense.merchant} size={48} />
          <div>
            <div className="text-lg font-bold text-ink">{expense.merchant}</div>
            <div className="text-sm text-ink-3">{categoryLabel(expense.category)}</div>
          </div>
        </div>
        <div className="text-3xl font-extrabold text-ink tracking-tighter leading-none mb-1">
          {formatNOK(expense.monthlyAmount)}
        </div>
        <div className="text-base text-ink-3 mb-4">per måned · {formatNOK(expense.yearlyAmount)} per år</div>
        <ProgressBar value={expense.occurrences} max={12} variant="accent" height={5} className="mb-2" />
        <div className="text-sm text-ink-3">{expense.occurrences} betalinger registrert</div>
      </div>

      <div className="flex gap-1.5 mx-4 mb-4 flex-wrap">
        <ConfidenceBadge confidence={expense.confidence} />
        <TrendBadge trend={expense.trend} />
      </div>

      {expense.trend === 'increasing' && (
        <div className="mx-4 mb-4">
          <InfoBox variant="warn" title="Prisøkning oppdaget">
            Prisen har økt fra {formatNOK(expense.amounts[expense.amounts.length - 1])} til {formatNOK(expense.amounts[0])} per måned.
          </InfoBox>
        </div>
      )}

      <SectionHeader title="Detaljer" />
      <div className="mx-4 mb-4">
        <Card>
          <CardRow>
            <span className="text-sm text-ink-2">Forhandler</span>
            <span className="text-sm font-semibold text-ink">{expense.merchant}</span>
          </CardRow>
          <CardRow>
            <span className="text-sm text-ink-2">Rådata</span>
            <span className="text-sm font-semibold text-ink">{expense.rawMerchantName}</span>
          </CardRow>
          <CardRow>
            <span className="text-sm text-ink-2">Kategori</span>
            <span className="text-sm font-semibold text-ink">{categoryLabel(expense.category)}</span>
          </CardRow>
          <CardRow>
            <span className="text-sm text-ink-2">Snitt intervall</span>
            <span className="text-sm font-semibold text-ink">{expense.averageInterval} dager</span>
          </CardRow>
          <CardRow>
            <span className="text-sm text-ink-2">Første registrert</span>
            <span className="text-sm font-semibold text-ink">{formatDateShort(expense.firstSeen)}</span>
          </CardRow>
          <CardRow>
            <span className="text-sm text-ink-2">Siste betaling</span>
            <span className="text-sm font-semibold text-ink">{formatDateShort(expense.lastCharged)}</span>
          </CardRow>
        </Card>
      </div>

      <SectionHeader title="Betalingshistorikk" />
      <div className="mx-4">
        <Card>
          {matchingTxs.slice(0, 6).map((tx) => (
            <CardRow key={tx.id}>
              <span className="text-sm text-ink-2">{formatDateShort(tx.bookingDate)}</span>
              <span className="text-sm font-semibold text-ink">
                {tx.creditDebitIndicator === 'DBIT' ? '−' : '+'}{formatNOK(parseFloat(tx.transactionAmount.value))}
              </span>
            </CardRow>
          ))}
        </Card>
      </div>

      <div className="mx-4 mt-5">
        <button
          onClick={() => navigate('/recurring')}
          className="w-full py-3.5 rounded-full bg-surface shadow-sm shadow-black/[0.06] text-ink text-base font-semibold text-center active:scale-[0.98] transition-transform"
        >
          Tilbake til oversikten
        </button>
      </div>
    </div>
  )
}
