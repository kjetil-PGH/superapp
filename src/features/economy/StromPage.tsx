import { useState } from 'react'
import { TopNav } from '@/components/layout/TopNav'
import { SectionHeader } from '@/components/layout/SectionHeader'
import { Card, CardRow } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { EpistemiskBadge } from '@/components/ui/EpistemiskBadge'
import { DataSourceTag } from '@/components/ui/DataSourceTag'
import { formatNOK } from '@/lib/format'

const usage = [
  { month: 'Nov', kwh: 380 },
  { month: 'Des', kwh: 420 },
  { month: 'Jan', kwh: 350 },
  { month: 'Feb', kwh: 280 },
  { month: 'Mar', kwh: 200 },
  { month: 'Apr', kwh: 230 },
]
const maxKwh = Math.max(...usage.map((u) => u.kwh))

const providers = [
  { name: 'Tibber', type: 'Spot', monthly: 1180, best: true },
  { name: 'Fjordkraft', type: 'Fast', monthly: 1250, best: false },
  { name: 'Gudbrandsdal Energi', type: 'Variabel', monthly: 1290, best: false },
]

export function StromPage() {
  const [alerts, setAlerts] = useState(false)
  const [autoControl, setAutoControl] = useState(false)

  return (
    <div className="flex flex-col min-h-screen bg-surface-2">
      <TopNav title="Strøm" showBack />

      <div className="flex-1 overflow-y-auto pb-28">
        <SectionHeader title="Din strømavtale" />

        <div className="px-5">
          <Card className="p-5 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-ink-3">Leverandør</span>
              <span className="font-semibold text-ink">Fjordkraft Variabel</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink-3">Estimert pris</span>
              <span className="font-semibold text-ink tabular-nums">
                ~{formatNOK(1340)}/mnd
              </span>
            </div>
            <div className="pt-1">
              <DataSourceTag variant="auto" label="Elhub" />
            </div>
          </Card>
        </div>

        <SectionHeader title="Forbruk siste 6 måneder" />

        <div className="px-5">
          <Card className="p-5">
            <div className="flex items-end gap-2 h-28">
              {usage.map((u) => (
                <div key={u.month} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col justify-end" style={{ height: 96 }}>
                    <div
                      className="w-full rounded-t-md bg-accent"
                      style={{ height: `${(u.kwh / maxKwh) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-ink-3">{u.month}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-ink-4 text-center mt-2">kWh per måned</p>
          </Card>
        </div>

        <SectionHeader title="Sammenlign leverandører" />

        <div className="px-5">
          <Card>
            {providers.map((p) => (
              <CardRow key={p.name}>
                <div>
                  <p className={`text-sm font-semibold ${p.best ? 'text-ok' : 'text-ink'}`}>
                    {p.name}
                  </p>
                  <p className="text-xs text-ink-3">{p.type}</p>
                </div>
                <span
                  className={`text-sm font-bold tabular-nums ${p.best ? 'text-ok' : 'text-ink'}`}
                >
                  ~{formatNOK(p.monthly)}/mnd
                </span>
              </CardRow>
            ))}
          </Card>
        </div>

        <div className="px-5 mt-4">
          <Card className="p-5">
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-ink-3">Mulig besparelse</span>
              <span className="text-sm font-bold text-ok tabular-nums">
                {formatNOK(160)}/mnd
              </span>
            </div>
            <p className="text-xs text-ink-4 mt-1">
              Ved bytte til Tibber (spot)
            </p>
          </Card>
        </div>

        <SectionHeader title="Overvåkning" />

        <div className="px-5">
          <Card className="divide-y divide-border">
            <div className="flex items-center justify-between px-[18px] py-[14px]">
              <span className="text-sm text-ink">Varsle ved høy pris</span>
              <button
                className={`relative w-11 h-6 rounded-full transition-colors ${alerts ? 'bg-accent' : 'bg-surface-3'}`}
                onClick={() => setAlerts(!alerts)}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${alerts ? 'translate-x-5' : ''}`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between px-[18px] py-[14px]">
              <span className="text-sm text-ink">Automatisk strømstyring</span>
              <button
                className={`relative w-11 h-6 rounded-full transition-colors ${autoControl ? 'bg-accent' : 'bg-surface-3'}`}
                onClick={() => setAutoControl(!autoControl)}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${autoControl ? 'translate-x-5' : ''}`}
                />
              </button>
            </div>
          </Card>
        </div>

        <div className="px-5 mt-4">
          <EpistemiskBadge variant="data-confirmed" />
        </div>

        <div className="px-5 mt-5">
          <Button>Bytt til Tibber</Button>
        </div>
      </div>
    </div>
  )
}
