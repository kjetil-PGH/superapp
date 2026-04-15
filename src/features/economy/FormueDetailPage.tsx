import { TopNav } from '@/components/layout/TopNav'
import { SectionHeader } from '@/components/layout/SectionHeader'
import { Card } from '@/components/ui/Card'
import { formatNOK, formatNOKShort } from '@/lib/format'
import { assets } from '@/data/assets-data'
import { debts, totalDebt, totalAssets, netWorth } from '@/data/debt-data'

const assetColors = ['#1565C0', '#2E7D32', '#E65100']
const debtColors = ['#C62828', '#E65100', '#9E9E9E']

function AllocationBar({ items, colors }: { items: { label: string; value: number }[]; colors: string[] }) {
  const total = items.reduce((s, i) => s + i.value, 0)
  return (
    <div>
      <div className="flex rounded-full overflow-hidden h-5">
        {items.map((item, i) => (
          <div
            key={item.label}
            style={{ width: `${(item.value / total) * 100}%`, backgroundColor: colors[i] }}
            className="transition-all duration-500"
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3">
        {items.map((item, i) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <span className="shrink-0 rounded-full" style={{ width: 8, height: 8, backgroundColor: colors[i] }} />
            <span className="text-xs text-ink-3">{item.label}</span>
            <span className="text-xs font-semibold text-ink">{formatNOKShort(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const assetItems = assets.map((a) => ({ label: a.name, value: a.value }))
const debtItems = debts.filter((d) => d.amount > 0).map((d) => ({ label: d.name, value: d.amount }))

const summaryRows = [
  { label: 'Sum eiendeler', value: totalAssets, color: 'text-ink' },
  { label: 'Sum gjeld', value: -totalDebt, color: 'text-err' },
  { label: 'Netto formue', value: netWorth, color: 'text-ok', bold: true },
]

export function FormueDetailPage() {
  return (
    <div className="flex flex-col min-h-full pb-32">
      <TopNav title="Formue" showBack />

      <Card className="mx-4 p-5">
        <p className="text-xs font-semibold text-ink-3 uppercase tracking-wider">Netto formue</p>
        <p className="text-[32px] font-bold text-ink mt-1 leading-tight">{formatNOKShort(netWorth)}</p>
      </Card>

      <SectionHeader title="Eiendeler" />

      <Card className="mx-4 mb-3 p-5">
        <AllocationBar items={assetItems} colors={assetColors} />
      </Card>

      <Card className="mx-4 mb-3">
        {assets.map((a) => (
          <div key={a.id} className="flex items-center justify-between px-5 py-3.5 border-b border-border last:border-b-0">
            <div>
              <p className="text-sm font-semibold text-ink">{a.name}</p>
              <p className="text-xs text-ink-3">{a.subtitle}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-ink">{formatNOK(a.value)}</p>
              <p className={`text-xs font-semibold ${a.change >= 0 ? 'text-ok' : 'text-err'}`}>
                {a.change >= 0 ? '+' : ''}{formatNOK(a.change)}
              </p>
            </div>
          </div>
        ))}
      </Card>

      <SectionHeader title="Gjeld" />

      <Card className="mx-4 mb-3 p-5">
        <AllocationBar items={debtItems} colors={debtColors} />
      </Card>

      <Card className="mx-4 mb-3">
        {debts.map((d) => (
          <div key={d.id} className="flex items-center justify-between px-5 py-3.5 border-b border-border last:border-b-0">
            <div>
              <p className="text-sm font-semibold text-ink">{d.name}</p>
              <p className="text-xs text-ink-3">{d.provider} · {d.rate > 0 ? `${d.rate.toFixed(1).replace('.', ',')}%` : 'Rentefri'}</p>
            </div>
            <p className="text-sm font-bold text-ink">{formatNOK(d.amount)}</p>
          </div>
        ))}
      </Card>

      <SectionHeader title="Oppsummering" />

      <Card className="mx-4 mb-3">
        {summaryRows.map((r) => (
          <div key={r.label} className="flex items-center justify-between px-5 py-3.5 border-b border-border last:border-b-0">
            <span className={`text-sm ${r.bold ? 'font-bold' : 'font-medium'} text-ink`}>{r.label}</span>
            <span className={`text-sm font-bold ${r.color}`}>{formatNOK(r.value)}</span>
          </div>
        ))}
      </Card>
    </div>
  )
}
