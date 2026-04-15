import { TopNav } from '@/components/layout/TopNav'
import { SectionHeader } from '@/components/layout/SectionHeader'
import { Card } from '@/components/ui/Card'
import { DataSourceTag } from '@/components/ui/DataSourceTag'
import { formatNOK } from '@/lib/format'
import { assets } from '@/data/assets-data'

const car = assets.find((a) => a.id === 'bil')!

const depreciationData = [365, 350, 335, 320, 310, 300, 295, 290, 285, 282, 280, 280]
const depMonths = ['Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des', 'Jan', 'Feb', 'Mar', 'Apr']

function DepreciationChart() {
  const w = 320
  const h = 150
  const pad = { top: 16, bottom: 28, left: 8, right: 8 }
  const min = Math.min(...depreciationData) - 20
  const max = Math.max(...depreciationData) + 20
  const xStep = (w - pad.left - pad.right) / (depreciationData.length - 1)
  const points = depreciationData.map((v, i) => {
    const x = pad.left + i * xStep
    const y = pad.top + (1 - (v - min) / (max - min)) * (h - pad.top - pad.bottom)
    return { x, y }
  })
  const polyline = points.map((p) => `${p.x},${p.y}`).join(' ')

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: 150 }}>
      <defs>
        <linearGradient id="dep-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E65100" stopOpacity={0.12} />
          <stop offset="100%" stopColor="#E65100" stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon
        points={`${pad.left},${h - pad.bottom} ${polyline} ${w - pad.right},${h - pad.bottom}`}
        fill="url(#dep-fill)"
      />
      <polyline points={polyline} fill="none" stroke="#E65100" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r={4} fill="#E65100" />
      {[0, 5, 11].map((i) => (
        <text key={i} x={points[i].x} y={h - 8} textAnchor="middle" className="fill-ink-3" style={{ fontSize: 9 }}>
          {depMonths[i]}
        </text>
      ))}
    </svg>
  )
}

const specs = [
  { label: 'Modell', value: 'Tesla Model 3 Long Range' },
  { label: 'Årsmodell', value: '2021' },
  { label: 'Reg.nr', value: 'EK 12345' },
  { label: 'Km-stand (est.)', value: '58 000 km' },
  { label: 'Drivstoff', value: 'Elektrisk' },
  { label: 'Neste EU-kontroll', value: 'August 2026' },
]

export function CarDetailPage() {
  return (
    <div className="flex flex-col min-h-full pb-32">
      <TopNav title="Kjøretøy" showBack />

      <Card className="mx-4 p-5">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🚗</span>
          <div>
            <p className="text-lg font-bold text-ink">{car.name}</p>
            <p className="text-sm text-ink-3">{car.subtitle}</p>
          </div>
        </div>

        <div className="mt-5 flex items-baseline gap-2">
          <span className="text-[32px] font-bold text-ink">{formatNOK(car.value)}</span>
        </div>
        <p className="text-sm text-err font-semibold mt-1">{formatNOK(car.change)} {car.changeLabel}</p>

        <div className="mt-3">
          <DataSourceTag variant="auto" label={car.source} />
        </div>
      </Card>

      <SectionHeader title="Nøkkeltall" />

      <Card className="mx-4 mb-3 p-5">
        <div className="grid grid-cols-3 gap-4">
          {car.stats.map((s) => (
            <div key={s.label}>
              <p className="text-[10px] text-ink-4 uppercase tracking-wide">{s.label}</p>
              <p className={`text-sm font-bold mt-0.5 ${s.color ? `text-${s.color}` : 'text-ink'}`}>{s.value}</p>
            </div>
          ))}
        </div>
      </Card>

      {car.insight && (
        <Card className="mx-4 mb-3 p-4">
          <div className="px-3 py-2.5 rounded-xl text-xs font-medium leading-snug bg-warn-bg text-warn">
            {car.insight}
          </div>
        </Card>
      )}

      <SectionHeader title="Verdiutvikling (12 mnd)" />

      <Card className="mx-4 mb-3 p-5">
        <DepreciationChart />
        <div className="flex justify-between mt-3 text-xs text-ink-3">
          <span>Verdifall: ~{formatNOK(85000)} totalt</span>
          <span>~{formatNOK(25000)}/år</span>
        </div>
      </Card>

      <SectionHeader title="EU-kontroll" />

      <Card className="mx-4 mb-3 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-ink">Neste EU-kontroll</p>
            <p className="text-xs text-ink-3 mt-0.5">Frist: August 2026</p>
          </div>
          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-ok-bg text-ok">Gyldig</span>
        </div>
        <div className="mt-4 relative h-2 rounded-full bg-surface-3">
          <div className="absolute inset-y-0 left-0 rounded-full bg-ok" style={{ width: '72%' }} />
        </div>
        <p className="text-[10px] text-ink-3 mt-1.5">Ca. 4 måneder til kontroll</p>
      </Card>

      <SectionHeader title="Spesifikasjoner" />

      <Card className="mx-4 mb-3">
        {specs.map((s) => (
          <div key={s.label} className="flex items-center justify-between px-5 py-3 border-b border-border last:border-b-0">
            <span className="text-sm text-ink-3">{s.label}</span>
            <span className="text-sm font-semibold text-ink">{s.value}</span>
          </div>
        ))}
      </Card>
    </div>
  )
}
