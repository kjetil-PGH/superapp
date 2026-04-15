export interface Asset {
  id: string
  type: 'property' | 'vehicle' | 'bank'
  name: string
  subtitle: string
  source: string
  value: number
  change: number
  changeLabel: string
  icon: string
  stats: { label: string; value: string; color?: string }[]
  insight?: string
  insightColor?: 'accent' | 'warn' | 'ok'
}

export const assets: Asset[] = [
  {
    id: 'bolig',
    type: 'property',
    name: 'Parkveien 22, Oslo',
    subtitle: '78 m² · Leilighet · Hjemla',
    source: 'Hjemla/Kartverket',
    value: 3800000,
    change: 640000,
    changeLabel: 'siden kjøp',
    icon: 'house',
    stats: [
      { label: 'siden kjøp', value: '+18%', color: 'ok' },
      { label: 'belåningsgrad', value: '54%' },
      { label: 'kr/m²', value: '53 846' },
    ],
    insight: 'Nabolaget steg 12% siste år – du ligger 29% under snitt-kvm-pris i Gamle Oslo',
    insightColor: 'accent',
  },
  {
    id: 'bil',
    type: 'vehicle',
    name: 'Tesla Model 3 · 2021',
    subtitle: 'EK 12345 · Statens vegvesen',
    source: 'Statens vegvesen',
    value: 280000,
    change: -85000,
    changeLabel: 'siden kjøp',
    icon: 'car',
    stats: [
      { label: 'siden kjøp', value: '−85 000', color: 'err' },
      { label: 'km kjørt', value: '58 000' },
      { label: 'EU-kontroll', value: 'Aug 26', color: 'ok' },
    ],
    insight: 'Faller ca. 25 000 kr/år – spør agenten om det lønner seg å selge nå',
    insightColor: 'warn',
  },
  {
    id: 'bank',
    type: 'bank',
    name: 'Bankinnskudd',
    subtitle: 'DNB · Brukskonto + Sparekonto · PSD2',
    source: 'PSD2',
    value: 1250000,
    change: 124000,
    changeLabel: 'siste år',
    icon: 'bank',
    stats: [
      { label: 'brukskonto', value: '70 000' },
      { label: 'sparekonto', value: '1 170 000', color: 'ok' },
      { label: 'rente', value: '4,0%', color: 'ok' },
    ],
    insight: 'Sparekontoen din gir 48 000 kr i renter per år på nåværende saldo',
    insightColor: 'accent',
  },
]
