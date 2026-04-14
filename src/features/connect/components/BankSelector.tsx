import { useState } from 'react'
import { Card, CardRow } from '@/components/ui/Card'
import { SectionHeader } from '@/components/layout/SectionHeader'
import type { Bank } from '@/lib/api'

const FLAG: Record<string, string> = { NO: '🇳🇴', SE: '🇸🇪', FI: '🇫🇮', DK: '🇩🇰', DE: '🇩🇪' }

interface Props {
  banks: Bank[]
  onSelect: (bank: Bank) => void
}

export function BankSelector({ banks, onSelect }: Props) {
  const [search, setSearch] = useState('')
  const filtered = banks.filter(
    b =>
      b.bankDisplayName.toLowerCase().includes(search.toLowerCase()) ||
      b.bankOfficialName.toLowerCase().includes(search.toLowerCase()),
  )

  const grouped = filtered.reduce<Record<string, Bank[]>>((acc, bank) => {
    const cc = bank.countryCode || 'OTHER'
    if (!acc[cc]) acc[cc] = []
    acc[cc].push(bank)
    return acc
  }, {})

  const countryOrder = ['NO', 'SE', 'FI', 'DK']
  const sortedCountries = Object.keys(grouped).sort(
    (a, b) => (countryOrder.indexOf(a) === -1 ? 99 : countryOrder.indexOf(a)) - (countryOrder.indexOf(b) === -1 ? 99 : countryOrder.indexOf(b)),
  )

  return (
    <div>
      <div className="mx-4 mt-4 mb-4">
        <div className="relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Søk etter bank..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-surface rounded-[14px] shadow-sm shadow-black/[0.04] text-sm text-ink placeholder:text-ink-4 focus:outline-none focus:ring-2 focus:ring-accent/15"
          />
        </div>
      </div>

      {sortedCountries.map(cc => (
        <div key={cc}>
          <SectionHeader title={`${FLAG[cc] || '🏦'} ${countryLabel(cc)}`} />
          <div className="mx-4 mb-3">
            <Card>
              {grouped[cc].map(bank => (
                <CardRow key={bank.id} onClick={() => onSelect(bank)}>
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-medium text-ink truncate">{bank.bankDisplayName}</div>
                    {bank.bankOfficialName && bank.bankOfficialName !== bank.bankDisplayName && (
                      <div className="text-sm text-ink-3 truncate">{bank.bankOfficialName}</div>
                    )}
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#BFBFBF" strokeWidth="2" strokeLinecap="round">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </CardRow>
              ))}
            </Card>
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div className="text-center text-ink-3 text-sm py-12">
          Ingen banker funnet for «{search}»
        </div>
      )}
    </div>
  )
}

function countryLabel(cc: string) {
  const labels: Record<string, string> = { NO: 'Norge', SE: 'Sverige', FI: 'Finland', DK: 'Danmark', DE: 'Tyskland' }
  return labels[cc] || cc
}
