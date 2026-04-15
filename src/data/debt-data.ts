export interface Debt {
  id: string
  name: string
  provider: string
  amount: number
  rate: number
  monthly: number
  severity: 'err' | 'warn' | 'ok'
  actionLabel?: string
  dest?: string
}

export const debts: Debt[] = [
  {
    id: 'forbrukslan',
    name: 'Forbrukslån',
    provider: 'Santander',
    amount: 38000,
    rate: 18.9,
    monthly: 1450,
    severity: 'err',
    actionLabel: 'refinansier nå',
    dest: '/economy/lan',
  },
  {
    id: 'boliglan',
    name: 'Boliglån',
    provider: 'DNB',
    amount: 2050000,
    rate: 5.8,
    monthly: 18450,
    severity: 'warn',
    actionLabel: 'kan forbedres til 4,6%',
    dest: '/economy/lan',
  },
  {
    id: 'kredittkort',
    name: 'Kredittkort',
    provider: 'DNB Visa',
    amount: 3200,
    rate: 0,
    monthly: 0,
    severity: 'ok',
    actionLabel: 'Betales ved forfall',
  },
]

export const totalDebt = 2088000
export const totalAssets = 5400000
export const netWorth = 3200000
export const netWorthChange = 270000
