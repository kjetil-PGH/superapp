export interface BudgetMonth {
  inn: number
  ut: number
  categories: Record<string, number>
}

export const budgetMonthKeys = ['jan','feb','mar','apr','mai','jun','jul','aug','sep','okt','nov','des'] as const
export type BudgetMonthKey = typeof budgetMonthKeys[number]

export const budgetMonthLabels: Record<BudgetMonthKey, string> = {
  jan: 'Januar 2025', feb: 'Februar 2025', mar: 'Mars 2025', apr: 'April 2025',
  mai: 'Mai 2025', jun: 'Juni 2025', jul: 'Juli 2025', aug: 'August 2025',
  sep: 'September 2025', okt: 'Oktober 2025', nov: 'November 2025', des: 'Desember 2025'
}

export const budgetData: Record<BudgetMonthKey, BudgetMonth> = {
  jan: { inn: 62000, ut: 38400, categories: { 'Restaurant og bar': 4200, 'Mat og dagligvarer': 3800, 'Transport': 1800, 'Abonnementer': 1650, 'Klær og sko': 2100, 'Sport og fritid': 890, 'Vennelag/Spleise': 1200, 'Hushold og hjem': 3200, 'Hushold og felles': 8400, 'Alkohol og vin': 2100, 'Reise': 0, 'Gaver': 0, 'Underholdning': 600, 'Helse og velvære': 800, 'Øvrige': 7660 }},
  feb: { inn: 62000, ut: 41200, categories: { 'Restaurant og bar': 5100, 'Mat og dagligvarer': 3600, 'Transport': 1600, 'Abonnementer': 1650, 'Klær og sko': 3400, 'Sport og fritid': 890, 'Vennelag/Spleise': 800, 'Hushold og hjem': 2900, 'Hushold og felles': 8400, 'Alkohol og vin': 1800, 'Reise': 4200, 'Gaver': 0, 'Underholdning': 400, 'Helse og velvære': 950, 'Øvrige': 5510 }},
  mar: { inn: 62000, ut: 44600, categories: { 'Restaurant og bar': 6200, 'Mat og dagligvarer': 3900, 'Transport': 2100, 'Abonnementer': 1650, 'Klær og sko': 2800, 'Sport og fritid': 890, 'Vennelag/Spleise': 3200, 'Hushold og hjem': 1200, 'Hushold og felles': 8400, 'Alkohol og vin': 2400, 'Reise': 5800, 'Gaver': 400, 'Underholdning': 0, 'Helse og velvære': 0, 'Øvrige': 5660 }},
  apr: { inn: 62000, ut: 46800, categories: { 'Restaurant og bar': 7100, 'Mat og dagligvarer': 4100, 'Transport': 2200, 'Abonnementer': 1650, 'Klær og sko': 4200, 'Sport og fritid': 890, 'Vennelag/Spleise': 1800, 'Hushold og hjem': 0, 'Hushold og felles': 8400, 'Alkohol og vin': 1200, 'Reise': 9800, 'Gaver': 0, 'Underholdning': 0, 'Helse og velvære': 0, 'Øvrige': 5460 }},
  mai: { inn: 62000, ut: 71200, categories: { 'Restaurant og bar': 4800, 'Mat og dagligvarer': 4200, 'Transport': 1600, 'Abonnementer': 1650, 'Klær og sko': 2600, 'Sport og fritid': 38000, 'Vennelag/Spleise': 1400, 'Hushold og hjem': 3800, 'Hushold og felles': 8400, 'Alkohol og vin': 1200, 'Reise': 0, 'Gaver': 0, 'Underholdning': 600, 'Helse og velvære': 950, 'Øvrige': 2000 }},
  jun: { inn: 78000, ut: 52400, categories: { 'Restaurant og bar': 5800, 'Mat og dagligvarer': 6200, 'Transport': 1400, 'Abonnementer': 1650, 'Klær og sko': 0, 'Sport og fritid': 2100, 'Vennelag/Spleise': 600, 'Hushold og hjem': 2800, 'Hushold og felles': 8400, 'Alkohol og vin': 9800, 'Reise': 0, 'Gaver': 0, 'Underholdning': 4200, 'Helse og velvære': 950, 'Øvrige': 8500 }},
  jul: { inn: 62000, ut: 18600, categories: { 'Restaurant og bar': 2800, 'Mat og dagligvarer': 2400, 'Transport': 900, 'Abonnementer': 1650, 'Klær og sko': 0, 'Sport og fritid': 890, 'Vennelag/Spleise': 1200, 'Hushold og hjem': 800, 'Hushold og felles': 0, 'Alkohol og vin': 0, 'Reise': 0, 'Gaver': 0, 'Underholdning': 0, 'Helse og velvære': 0, 'Øvrige': 7960 }},
  aug: { inn: 62000, ut: 49800, categories: { 'Restaurant og bar': 8200, 'Mat og dagligvarer': 5400, 'Transport': 1200, 'Abonnementer': 1650, 'Klær og sko': 2200, 'Sport og fritid': 890, 'Vennelag/Spleise': 3800, 'Hushold og hjem': 6200, 'Hushold og felles': 8400, 'Alkohol og vin': 7400, 'Reise': 0, 'Gaver': 400, 'Underholdning': 2400, 'Helse og velvære': 1800, 'Øvrige': 860 }},
  sep: { inn: 62000, ut: 42600, categories: { 'Restaurant og bar': 9400, 'Mat og dagligvarer': 3800, 'Transport': 2400, 'Abonnementer': 1650, 'Klær og sko': 2800, 'Sport og fritid': 890, 'Vennelag/Spleise': 2200, 'Hushold og hjem': 0, 'Hushold og felles': 8400, 'Alkohol og vin': 0, 'Reise': 0, 'Gaver': 0, 'Underholdning': 600, 'Helse og velvære': 0, 'Øvrige': 10460 }},
  okt: { inn: 62000, ut: 45200, categories: { 'Restaurant og bar': 8800, 'Mat og dagligvarer': 3600, 'Transport': 800, 'Abonnementer': 1650, 'Klær og sko': 2400, 'Sport og fritid': 2800, 'Vennelag/Spleise': 3200, 'Hushold og hjem': 1800, 'Hushold og felles': 8400, 'Alkohol og vin': 0, 'Reise': 400, 'Gaver': 0, 'Underholdning': 800, 'Helse og velvære': 950, 'Øvrige': 9600 }},
  nov: { inn: 62000, ut: 36400, categories: { 'Restaurant og bar': 5200, 'Mat og dagligvarer': 3800, 'Transport': 800, 'Abonnementer': 1650, 'Klær og sko': 1200, 'Sport og fritid': 890, 'Vennelag/Spleise': 400, 'Hushold og hjem': 0, 'Hushold og felles': 8400, 'Alkohol og vin': 0, 'Reise': 0, 'Gaver': 0, 'Underholdning': 0, 'Helse og velvære': 0, 'Øvrige': 14060 }},
  des: { inn: 74000, ut: 54600, categories: { 'Restaurant og bar': 4800, 'Mat og dagligvarer': 4200, 'Transport': 1600, 'Abonnementer': 3200, 'Klær og sko': 2400, 'Sport og fritid': 890, 'Vennelag/Spleise': 4200, 'Hushold og hjem': 3600, 'Hushold og felles': 8400, 'Alkohol og vin': 7800, 'Reise': 4800, 'Gaver': 6200, 'Underholdning': 0, 'Helse og velvære': 1400, 'Øvrige': 1110 }},
}

export const fixedExpenses = [
  { name: 'Boliglån', amount: 18450, dest: '/economy/lan' },
  { name: 'Forsikring', amount: 1379, dest: '/economy/forsikring' },
  { name: 'Strøm', amount: 1340, dest: '/economy/strom' },
  { name: 'Abonnementer', amount: 2400, dest: '/recurring' },
  { name: 'Telia TV og nett', amount: 989, dest: '/economy/mobil' },
]
