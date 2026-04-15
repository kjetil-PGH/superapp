import { useNavigate } from 'react-router-dom'
import { TopNav } from '@/components/layout/TopNav'
import { SectionHeader } from '@/components/layout/SectionHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { EpistemiskBadge } from '@/components/ui/EpistemiskBadge'
import { formatNOK } from '@/lib/format'

const current = [
  { label: 'Forbrukslån 18,9 %', amount: 1450 },
  { label: 'Boliglån 5,8 %', amount: 18450 },
]
const currentTotal = 19900
const samlelanRate = 4.6
const samlelanMonthly = 17850
const savingMonthly = currentTotal - samlelanMonthly
const savingYearly = savingMonthly * 12

function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  return (
    <div className="h-5 w-full rounded-full bg-surface-3">
      <div
        className={`h-5 rounded-full ${color}`}
        style={{ width: `${(value / max) * 100}%` }}
      />
    </div>
  )
}

export function SamlelanPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col min-h-screen bg-surface-2">
      <TopNav title="Samlelån" showBack />

      <div className="flex-1 overflow-y-auto pb-28">
        <SectionHeader title="Dagens situasjon" />

        <div className="px-5">
          <Card className="p-5 space-y-3">
            {current.map((c) => (
              <div key={c.label} className="flex justify-between text-sm">
                <span className="text-ink-3">{c.label}</span>
                <span className="font-semibold text-ink tabular-nums">
                  {formatNOK(c.amount)}/mnd
                </span>
              </div>
            ))}
            <div className="flex justify-between text-sm pt-2 border-t border-border">
              <span className="font-semibold text-ink">Totalt</span>
              <span className="font-bold text-ink tabular-nums">
                {formatNOK(currentTotal)}/mnd
              </span>
            </div>
          </Card>
        </div>

        <SectionHeader title="Med samlelån" />

        <div className="px-5">
          <Card className="p-5 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-ink-3">Samlelån {samlelanRate} %</span>
              <span className="font-semibold text-ink tabular-nums">
                {formatNOK(samlelanMonthly)}/mnd
              </span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t border-border">
              <span className="font-semibold text-ok">Sparer</span>
              <span className="font-bold text-ok tabular-nums">
                {formatNOK(savingMonthly)}/mnd = {formatNOK(savingYearly)}/år
              </span>
            </div>
          </Card>
        </div>

        <SectionHeader title="Sammenligning" />

        <div className="px-5 space-y-3">
          <div>
            <p className="text-xs text-ink-3 mb-1">
              Før – {formatNOK(currentTotal)}/mnd
            </p>
            <Bar value={currentTotal} max={currentTotal} color="bg-warn" />
          </div>
          <div>
            <p className="text-xs text-ink-3 mb-1">
              Etter – {formatNOK(samlelanMonthly)}/mnd
            </p>
            <Bar value={samlelanMonthly} max={currentTotal} color="bg-ok" />
          </div>
        </div>

        <div className="px-5 mt-5 flex flex-wrap gap-2">
          <EpistemiskBadge variant="effect-high" />
          <EpistemiskBadge variant="effort-low" />
          <EpistemiskBadge variant="data-confirmed" />
        </div>

        <div className="px-5 mt-6">
          <Button onClick={() => navigate('/economy/lan')}>Gå videre</Button>
        </div>
      </div>
    </div>
  )
}
