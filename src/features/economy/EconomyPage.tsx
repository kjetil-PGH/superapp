import { useNavigate } from 'react-router-dom'
import { TopNav } from '@/components/layout/TopNav'
import { SectionHeader } from '@/components/layout/SectionHeader'
import { Card } from '@/components/ui/Card'
import { GoalCard } from '@/components/ui/GoalCard'
import { DataSourceTag } from '@/components/ui/DataSourceTag'
import { formatNOK, formatNOKShort } from '@/lib/format'
import { assets } from '@/data/assets-data'
import { debts, netWorth, netWorthChange } from '@/data/debt-data'
import { goals } from '@/data/goals-data'

const iconMap: Record<string, string> = { house: '🏠', car: '🚗', bank: '🏦' }
const destMap: Record<string, string> = { bolig: '/economy/eiendom', bil: '/economy/bil', bank: '/economy/formue' }

const chartPoints = [2.4, 2.5, 2.6, 2.7, 2.8, 2.85, 2.9, 3.0, 3.05, 3.1, 3.15, 3.2]

function NetWorthChart() {
  const w = 320
  const h = 150
  const pad = { top: 16, bottom: 16, left: 0, right: 0 }
  const min = Math.min(...chartPoints) - 0.1
  const max = Math.max(...chartPoints) + 0.1
  const xStep = (w - pad.left - pad.right) / (chartPoints.length - 1)
  const points = chartPoints.map((v, i) => {
    const x = pad.left + i * xStep
    const y = pad.top + (1 - (v - min) / (max - min)) * (h - pad.top - pad.bottom)
    return `${x},${y}`
  })

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: 150 }}>
      <defs>
        <linearGradient id="nw-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2E7D32" stopOpacity={0.15} />
          <stop offset="100%" stopColor="#2E7D32" stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon
        points={`${pad.left},${h - pad.bottom} ${points.join(' ')} ${w - pad.right},${h - pad.bottom}`}
        fill="url(#nw-fill)"
      />
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke="#2E7D32"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const severityDot: Record<string, string> = { err: 'bg-err', warn: 'bg-warn', ok: 'bg-ok' }

function insightBg(color?: string) {
  if (color === 'accent') return 'bg-accent-light text-accent'
  if (color === 'warn') return 'bg-warn-bg text-warn'
  if (color === 'ok') return 'bg-ok-bg text-ok'
  return 'bg-surface-3 text-ink-3'
}

export function EconomyPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col min-h-full pb-32">
      <TopNav title="Økonomi" />

      <Card className="mx-4 p-5">
        <p className="text-xs font-semibold text-ink-3 uppercase tracking-wider">Netto formue</p>
        <p className="text-[32px] font-bold text-ink mt-1 leading-tight">{formatNOKShort(netWorth)}</p>
        <span className="inline-block mt-1.5 px-2 py-0.5 rounded-md text-xs font-semibold bg-ok-bg text-ok">
          +{formatNOK(netWorthChange)} siste år
        </span>
        <div className="mt-4 -mx-1">
          <NetWorthChart />
        </div>
      </Card>

      <SectionHeader title="Eiendeler" />

      {assets.map((a) => (
        <Card
          key={a.id}
          className="mx-4 mb-3 p-5"
          onClick={() => navigate(destMap[a.id] ?? '/economy')}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{iconMap[a.icon] ?? '📦'}</span>
              <div>
                <p className="text-sm font-semibold text-ink">{a.name}</p>
                <p className="text-xs text-ink-3 mt-0.5">{a.subtitle}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-base font-bold text-ink">{formatNOK(a.value)}</p>
              <p className={`text-xs font-semibold mt-0.5 ${a.change >= 0 ? 'text-ok' : 'text-err'}`}>
                {a.change >= 0 ? '+' : ''}{formatNOK(a.change)} {a.changeLabel}
              </p>
            </div>
          </div>

          <div className="flex gap-4 mt-4">
            {a.stats.map((s) => (
              <div key={s.label} className="flex-1">
                <p className="text-[10px] text-ink-4 uppercase tracking-wide">{s.label}</p>
                <p className={`text-sm font-bold ${s.color ? `text-${s.color}` : 'text-ink'}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {a.insight && (
            <div className={`mt-4 px-3 py-2.5 rounded-xl text-xs font-medium leading-snug ${insightBg(a.insightColor)}`}>
              {a.insight}
            </div>
          )}

          <div className="mt-3">
            <DataSourceTag variant="auto" label={a.source} />
          </div>
        </Card>
      ))}

      <SectionHeader title="Gjeld" action="Se detaljer" onAction={() => navigate('/economy/lan')} />

      <Card className="mx-4 mb-3">
        {debts.map((d) => (
          <div key={d.id} className="flex items-center justify-between px-5 py-3.5 border-b border-border last:border-b-0">
            <div className="flex items-center gap-3">
              <span className={`shrink-0 rounded-full ${severityDot[d.severity]}`} style={{ width: 8, height: 8 }} />
              <div>
                <p className="text-sm font-semibold text-ink">{d.name}</p>
                <p className="text-xs text-ink-3">{d.provider} · {d.rate > 0 ? `${d.rate.toFixed(1).replace('.', ',')}%` : 'Rentefri'}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-ink">{formatNOK(d.amount)}</p>
              {d.monthly > 0 && <p className="text-xs text-ink-3">{formatNOK(d.monthly)}/mnd</p>}
              {d.actionLabel && (
                <p className="text-[11px] font-semibold text-accent mt-0.5">{d.actionLabel}</p>
              )}
            </div>
          </div>
        ))}
      </Card>

      <SectionHeader title="Sparemål" action="Se alle" onAction={() => navigate('/economy/sparemal')} />

      <div className="px-4 space-y-3">
        {goals.map((g) => (
          <GoalCard key={g.id} {...g} />
        ))}
      </div>

      <SectionHeader title="Likviditet" />

      <Card className="mx-4 mb-3 p-5">
        <p className="text-sm font-semibold text-ink">30-dagers likviditetsprognose</p>
        <p className="text-2xl font-bold text-ink mt-2">~52 000 kr</p>
        <p className="text-xs text-ink-3 mt-1">Forventet saldo om 30 dager</p>
        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1">
            <div className="relative h-2 rounded-full bg-surface-3">
              <div className="absolute inset-y-0 left-0 rounded-full bg-accent" style={{ width: '65%' }} />
            </div>
            <div className="flex justify-between text-[10px] text-ink-3 mt-1.5">
              <span>Nå: 70 000 kr</span>
              <span>Om 30d: ~52 000 kr</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
