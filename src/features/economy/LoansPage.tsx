import { useNavigate } from 'react-router-dom'
import { TopNav } from '@/components/layout/TopNav'
import { SectionHeader } from '@/components/layout/SectionHeader'
import { Card, CardRow } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { DataSourceTag } from '@/components/ui/DataSourceTag'
import { formatNOK } from '@/lib/format'
import { debts } from '@/data/debt-data'

const severityColor = { err: 'bg-err', warn: 'bg-warn', ok: 'bg-ok' } as const

const sorted = [...debts].sort((a, b) => b.rate - a.rate)
const totalDebt = debts.reduce((s, d) => s + d.amount, 0)
const weightedRate =
  debts.reduce((s, d) => s + d.rate * d.amount, 0) / totalDebt

const actions = [
  { label: 'Se samlelån-kalkulator', dest: '/economy/lan/samlelan' },
  { label: 'Refinansier boliglån', dest: '/economy/lan/refinansier' },
  { label: 'Forhandle med banken', dest: '/economy/lan/forhandle' },
]

export function LoansPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col min-h-screen bg-surface-2">
      <TopNav title="Lån og gjeld" showBack />

      <div className="flex-1 overflow-y-auto pb-28">
        <SectionHeader title="Din gjeld" />

        <div className="px-5">
          <Card>
            {sorted.map((d) => (
              <CardRow key={d.id}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`shrink-0 rounded-full ${severityColor[d.severity]}`}
                      style={{ width: 8, height: 8 }}
                    />
                    <span className="text-sm font-semibold text-ink truncate">
                      {d.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 ml-[16px]">
                    <span className="text-xs text-ink-3">{d.provider}</span>
                    <span className="text-xs text-ink-4">·</span>
                    <span className="text-xs text-ink-3">{d.rate} %</span>
                    <span className="text-xs text-ink-4">·</span>
                    <span className="text-xs text-ink-3">
                      {formatNOK(d.monthly)}/mnd
                    </span>
                  </div>
                  <div className="mt-1.5 ml-[16px]">
                    <DataSourceTag variant="auto" label="Gjeldsregisteret" />
                  </div>
                </div>
                <span className="text-sm font-semibold text-ink tabular-nums whitespace-nowrap">
                  {formatNOK(d.amount)}
                </span>
              </CardRow>
            ))}
          </Card>
        </div>

        <SectionHeader title="Totalt" />

        <div className="px-5">
          <Card className="p-5">
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-ink-3">Total gjeld</span>
              <span className="text-lg font-bold text-ink">
                {formatNOK(totalDebt)}
              </span>
            </div>
            <div className="flex justify-between items-baseline mt-2">
              <span className="text-sm text-ink-3">Vektet snittrente</span>
              <span className="text-lg font-bold text-ink">
                {weightedRate.toFixed(1)} %
              </span>
            </div>
          </Card>
        </div>

        <SectionHeader title="Handlinger" />

        <div className="px-5 space-y-3">
          {actions.map((a) => (
            <Button
              key={a.dest}
              variant="secondary"
              onClick={() => navigate(a.dest)}
            >
              {a.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
