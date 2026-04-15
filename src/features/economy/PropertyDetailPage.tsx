import { TopNav } from '@/components/layout/TopNav'
import { SectionHeader } from '@/components/layout/SectionHeader'
import { Card } from '@/components/ui/Card'
import { DataSourceTag } from '@/components/ui/DataSourceTag'
import { formatNOK } from '@/lib/format'
import { assets } from '@/data/assets-data'

const property = assets.find((a) => a.id === 'bolig')!

const priceHistory = [2800, 2950, 3050, 3200, 3350, 3400, 3500, 3600, 3650, 3700, 3750, 3800]
const months = ['Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des', 'Jan', 'Feb', 'Mar', 'Apr']

function PriceChart() {
  const w = 320
  const h = 160
  const pad = { top: 20, bottom: 28, left: 8, right: 8 }
  const min = Math.min(...priceHistory) - 100
  const max = Math.max(...priceHistory) + 100
  const xStep = (w - pad.left - pad.right) / (priceHistory.length - 1)
  const points = priceHistory.map((v, i) => {
    const x = pad.left + i * xStep
    const y = pad.top + (1 - (v - min) / (max - min)) * (h - pad.top - pad.bottom)
    return { x, y }
  })
  const polyline = points.map((p) => `${p.x},${p.y}`).join(' ')

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: 160 }}>
      <defs>
        <linearGradient id="price-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1565C0" stopOpacity={0.12} />
          <stop offset="100%" stopColor="#1565C0" stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon
        points={`${pad.left},${h - pad.bottom} ${polyline} ${w - pad.right},${h - pad.bottom}`}
        fill="url(#price-fill)"
      />
      <polyline points={polyline} fill="none" stroke="#1565C0" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r={4} fill="#1565C0" />
      {[0, 5, 11].map((i) => (
        <text key={i} x={points[i].x} y={h - 8} textAnchor="middle" className="fill-ink-3" style={{ fontSize: 9 }}>
          {months[i]}
        </text>
      ))}
    </svg>
  )
}

const neighborhood = [
  { label: 'Snitt kvm-pris i Gamle Oslo', value: '75 900 kr', yours: '53 846 kr', delta: '−29%' },
  { label: 'Prisutvikling nabolag (12 mnd)', value: '+12%', yours: '+18%', delta: '+6pp' },
  { label: 'Antall salg i område (12 mnd)', value: '134', yours: null, delta: null },
]

export function PropertyDetailPage() {
  return (
    <div className="flex flex-col min-h-full pb-32">
      <TopNav title="Bolig" showBack />

      <Card className="mx-4 p-5">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🏠</span>
          <div>
            <p className="text-lg font-bold text-ink">{property.name}</p>
            <p className="text-sm text-ink-3">{property.subtitle}</p>
          </div>
        </div>

        <div className="mt-5 flex items-baseline gap-2">
          <span className="text-[32px] font-bold text-ink">{formatNOK(property.value)}</span>
        </div>
        <p className="text-sm text-ok font-semibold mt-1">+{formatNOK(property.change)} {property.changeLabel}</p>

        <div className="mt-3">
          <DataSourceTag variant="auto" label={property.source} />
        </div>
      </Card>

      <SectionHeader title="Nøkkeltall" />

      <Card className="mx-4 mb-3 p-5">
        <div className="grid grid-cols-3 gap-4">
          {property.stats.map((s) => (
            <div key={s.label}>
              <p className="text-[10px] text-ink-4 uppercase tracking-wide">{s.label}</p>
              <p className={`text-sm font-bold mt-0.5 ${s.color ? `text-${s.color}` : 'text-ink'}`}>{s.value}</p>
            </div>
          ))}
        </div>
      </Card>

      {property.insight && (
        <Card className="mx-4 mb-3 p-4">
          <div className="px-3 py-2.5 rounded-xl text-xs font-medium leading-snug bg-accent-light text-accent">
            {property.insight}
          </div>
        </Card>
      )}

      <SectionHeader title="Prisutviklling (12 mnd)" />

      <Card className="mx-4 mb-3 p-5">
        <PriceChart />
        <div className="flex justify-between mt-3 text-xs text-ink-3">
          <span>Estimert {formatNOK(priceHistory[0] * 1000)} → {formatNOK(priceHistory[priceHistory.length - 1] * 1000)}</span>
        </div>
      </Card>

      <SectionHeader title="Sammenligning med nabolag" />

      <Card className="mx-4 mb-3">
        {neighborhood.map((n) => (
          <div key={n.label} className="px-5 py-3.5 border-b border-border last:border-b-0">
            <p className="text-xs text-ink-3 mb-1.5">{n.label}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-ink">{n.value}</span>
              {n.yours && (
                <span className="text-sm text-ink-3">
                  Din: <span className="font-semibold text-ink">{n.yours}</span>
                  {n.delta && <span className="ml-1.5 text-xs font-semibold text-accent">{n.delta}</span>}
                </span>
              )}
            </div>
          </div>
        ))}
      </Card>
    </div>
  )
}
