import type { NeonomicsTransaction } from '@/types/neonomics'
import type { RecurringExpense, Confidence, Trend, ExpenseCategory } from '@/types/domain'
import { merchantRules } from '@/data/merchants'

interface NormalizedMerchant {
  name: string
  category: ExpenseCategory
}

function cleanMerchantName(raw: string): string {
  return raw
    .replace(/\d{2}[./]\d{2}([./]\d{2,4})?/g, '')
    .replace(/\*+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
}

export function normalizeMerchant(raw: string): NormalizedMerchant | null {
  const input = raw.trim().toUpperCase()
  for (const rule of merchantRules) {
    for (const pattern of rule.patterns) {
      if (pattern.test(input)) {
        return { name: rule.name, category: rule.category }
      }
    }
  }
  return null
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a).getTime()
  const db = new Date(b).getTime()
  return Math.abs(da - db) / (1000 * 60 * 60 * 24)
}

function computeConfidence(occurrences: number, amounts: number[], avgInterval: number): Confidence {
  if (occurrences >= 4) {
    const allSame = amounts.every(a => a === amounts[0])
    if (allSame && avgInterval >= 26 && avgInterval <= 35) return 'high'
    if (avgInterval >= 26 && avgInterval <= 35) return 'high'
    return 'medium'
  }
  if (occurrences >= 3) {
    if (avgInterval >= 26 && avgInterval <= 35) return 'medium'
    return 'low'
  }
  return 'low'
}

function computeTrend(amounts: number[]): Trend {
  if (amounts.length < 2) return 'stable'
  const recent = amounts.slice(0, Math.min(3, amounts.length))
  const older = amounts.slice(Math.min(3, amounts.length))
  if (older.length === 0) return 'stable'
  const avgRecent = recent.reduce((s, v) => s + v, 0) / recent.length
  const avgOlder = older.reduce((s, v) => s + v, 0) / older.length
  const diff = (avgRecent - avgOlder) / avgOlder
  if (diff > 0.05) return 'increasing'
  if (diff < -0.05) return 'decreasing'
  return 'stable'
}

export function detectRecurring(transactions: NeonomicsTransaction[]): RecurringExpense[] {
  const debits = transactions
    .filter(t => t.creditDebitIndicator === 'DBIT')
    .sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime())

  const grouped = new Map<string, { merchant: NormalizedMerchant; txs: NeonomicsTransaction[] }>()

  for (const tx of debits) {
    const ref = tx.transactionReference || tx.counterpartyName || ''
    if (!ref) continue

    const normalized = normalizeMerchant(ref)
    const merchantName = normalized?.name ?? cleanMerchantName(ref)
    const category = normalized?.category ?? 'other'
    const key = merchantName

    if (!grouped.has(key)) {
      grouped.set(key, { merchant: { name: merchantName, category }, txs: [] })
    }
    grouped.get(key)!.txs.push(tx)
  }

  const results: RecurringExpense[] = []

  for (const [, { merchant, txs }] of grouped) {
    if (txs.length < 2) continue

    const sorted = txs.sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime())
    const amounts = sorted.map(t => parseFloat(t.transactionAmount.value))
    const dates = sorted.map(t => t.bookingDate)

    const intervals: number[] = []
    for (let i = 0; i < dates.length - 1; i++) {
      intervals.push(daysBetween(dates[i], dates[i + 1]))
    }
    const avgInterval = intervals.length > 0
      ? intervals.reduce((s, v) => s + v, 0) / intervals.length
      : 0

    const isMonthly = avgInterval >= 20 && avgInterval <= 40

    if (!isMonthly && amounts.length < 3) continue

    const latestAmount = amounts[0]
    const monthlyAmount = isMonthly ? latestAmount : latestAmount / (avgInterval / 30)
    const confidence = computeConfidence(txs.length, amounts, avgInterval)
    const trend = computeTrend(amounts)

    results.push({
      id: `rec-${merchant.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      merchant: merchant.name,
      rawMerchantName: sorted[0].transactionReference,
      category: merchant.category,
      monthlyAmount: Math.round(monthlyAmount),
      yearlyAmount: Math.round(monthlyAmount * 12),
      confidence,
      lastCharged: dates[0],
      firstSeen: dates[dates.length - 1],
      occurrences: txs.length,
      trend,
      averageInterval: Math.round(avgInterval),
      amounts,
    })
  }

  return results.sort((a, b) => b.monthlyAmount - a.monthlyAmount)
}
