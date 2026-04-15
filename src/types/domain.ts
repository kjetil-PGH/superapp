export type Confidence = 'high' | 'medium' | 'low'
export type Trend = 'stable' | 'increasing' | 'decreasing'

export type ExpenseCategory =
  | 'streaming'
  | 'music'
  | 'software'
  | 'telecom'
  | 'fitness'
  | 'news'
  | 'gaming'
  | 'cloud'
  | 'food_delivery'
  | 'insurance'
  | 'other'

export interface RecurringExpense {
  id: string
  merchant: string
  rawMerchantName: string
  category: ExpenseCategory
  monthlyAmount: number
  yearlyAmount: number
  confidence: Confidence
  lastCharged: string
  firstSeen: string
  occurrences: number
  trend: Trend
  averageInterval: number
  amounts: number[]
}

export interface Insight {
  id: string
  type: 'saving_opportunity' | 'price_increase' | 'unused_subscription' | 'category_summary' | 'trend'
  title: string
  description: string
  severity: 'info' | 'warning' | 'critical'
  potentialMonthlySaving?: number
  potentialYearlySaving?: number
  relatedExpenseId?: string
  merchantName?: string
  merchantNames?: string[]
}

export interface CategoryBreakdown {
  category: ExpenseCategory
  label: string
  monthlyTotal: number
  yearlyTotal: number
  count: number
  percentage: number
}

export interface RecurringSummary {
  totalMonthly: number
  totalYearly: number
  expenseCount: number
  expenses: RecurringExpense[]
  insights: Insight[]
  categories: CategoryBreakdown[]
}
