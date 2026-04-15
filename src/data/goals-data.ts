export interface SavingsGoal {
  id: string
  name: string
  icon: string
  target: number
  current: number
  deadline: string
  monthsLeft: number
}

export const goals: SavingsGoal[] = [
  {
    id: 'japan',
    name: 'Japan-tur 2027',
    icon: '✈️',
    target: 50000,
    current: 34200,
    deadline: 'Oktober 2026',
    monthsLeft: 6,
  },
  {
    id: 'buffer',
    name: 'Buffer',
    icon: '⭐',
    target: 102600,
    current: 38000,
    deadline: 'Mars 2027',
    monthsLeft: 18,
  },
]
