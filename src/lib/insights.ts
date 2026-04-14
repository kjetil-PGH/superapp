import type { RecurringExpense, Insight, CategoryBreakdown, RecurringSummary, ExpenseCategory } from '@/types/domain'
import { categoryLabel } from './format'

function generateInsights(expenses: RecurringExpense[]): Insight[] {
  const insights: Insight[] = []

  // Price increase detection
  for (const exp of expenses) {
    if (exp.trend === 'increasing' && exp.amounts.length >= 3) {
      const oldest = exp.amounts[exp.amounts.length - 1]
      const newest = exp.amounts[0]
      const increase = newest - oldest
      if (increase > 0) {
        insights.push({
          id: `ins-increase-${exp.id}`,
          type: 'price_increase',
          title: `${exp.merchant} har økt i pris`,
          description: `Prisen har gått fra ${oldest} kr til ${newest} kr/mnd (+${increase} kr). Vurder om du fortsatt trenger dette.`,
          severity: increase > 50 ? 'warning' : 'info',
          potentialMonthlySaving: increase,
          potentialYearlySaving: increase * 12,
          relatedExpenseId: exp.id,
        })
      }
    }
  }

  // Streaming consolidation
  const streamingExpenses = expenses.filter(e => e.category === 'streaming')
  if (streamingExpenses.length >= 3) {
    const totalStreaming = streamingExpenses.reduce((s, e) => s + e.monthlyAmount, 0)
    insights.push({
      id: 'ins-streaming-bundle',
      type: 'saving_opportunity',
      title: `${streamingExpenses.length} strømmetjenester til ${totalStreaming} kr/mnd`,
      description: `Du betaler for ${streamingExpenses.map(e => e.merchant).join(', ')}. Vurder om du bruker alle aktivt.`,
      severity: totalStreaming > 500 ? 'warning' : 'info',
      potentialMonthlySaving: Math.round(totalStreaming * 0.3),
      potentialYearlySaving: Math.round(totalStreaming * 0.3 * 12),
    })
  }

  // Low-confidence subscriptions
  const lowConf = expenses.filter(e => e.confidence === 'low')
  for (const exp of lowConf) {
    insights.push({
      id: `ins-uncertain-${exp.id}`,
      type: 'unused_subscription',
      title: `Usikker: ${exp.merchant}`,
      description: `Vi er usikre på om dette er en fast utgift. Bekreft om du bruker ${exp.merchant} aktivt.`,
      severity: 'info',
      potentialMonthlySaving: exp.monthlyAmount,
      potentialYearlySaving: exp.yearlyAmount,
      relatedExpenseId: exp.id,
    })
  }

  // Total cost awareness
  const totalMonthly = expenses.reduce((s, e) => s + e.monthlyAmount, 0)
  if (totalMonthly > 2000) {
    insights.push({
      id: 'ins-total-cost',
      type: 'category_summary',
      title: `Faste utgifter: ${totalMonthly.toLocaleString('nb-NO')} kr/mnd`,
      description: `Dine gjenkjente faste utgifter koster ${(totalMonthly * 12).toLocaleString('nb-NO')} kr per år. Se om noe kan kuttes.`,
      severity: totalMonthly > 4000 ? 'warning' : 'info',
    })
  }

  return insights.sort((a, b) => {
    const sevOrder = { critical: 0, warning: 1, info: 2 }
    return sevOrder[a.severity] - sevOrder[b.severity]
  })
}

function buildCategories(expenses: RecurringExpense[]): CategoryBreakdown[] {
  const totalMonthly = expenses.reduce((s, e) => s + e.monthlyAmount, 0)
  const map = new Map<ExpenseCategory, { items: RecurringExpense[] }>()

  for (const exp of expenses) {
    if (!map.has(exp.category)) {
      map.set(exp.category, { items: [] })
    }
    map.get(exp.category)!.items.push(exp)
  }

  return Array.from(map.entries())
    .map(([cat, { items }]) => {
      const monthlyTotal = items.reduce((s, e) => s + e.monthlyAmount, 0)
      return {
        category: cat,
        label: categoryLabel(cat),
        monthlyTotal,
        yearlyTotal: monthlyTotal * 12,
        count: items.length,
        percentage: totalMonthly > 0 ? Math.round((monthlyTotal / totalMonthly) * 100) : 0,
      }
    })
    .sort((a, b) => b.monthlyTotal - a.monthlyTotal)
}

export function buildRecurringSummary(expenses: RecurringExpense[]): RecurringSummary {
  const totalMonthly = expenses.reduce((s, e) => s + e.monthlyAmount, 0)
  return {
    totalMonthly,
    totalYearly: totalMonthly * 12,
    expenseCount: expenses.length,
    expenses,
    insights: generateInsights(expenses),
    categories: buildCategories(expenses),
  }
}
