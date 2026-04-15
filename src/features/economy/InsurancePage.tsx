import { TopNav } from '@/components/layout/TopNav'
import { SectionHeader } from '@/components/layout/SectionHeader'
import { Card, CardRow } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { EpistemiskBadge } from '@/components/ui/EpistemiskBadge'
import { DataSourceTag } from '@/components/ui/DataSourceTag'
import { formatNOK } from '@/lib/format'

const policies = [
  { id: 'innbo', name: 'Innbo', provider: 'Gjensidige', monthly: 289, warn: false },
  { id: 'reise', name: 'Reise', provider: 'Gjensidige', monthly: 290, warn: true },
  { id: 'bil', name: 'Bil', provider: 'If', monthly: 1089, warn: false },
]

export function InsurancePage() {
  return (
    <div className="flex flex-col min-h-screen bg-surface-2">
      <TopNav title="Forsikring" showBack />

      <div className="flex-1 overflow-y-auto pb-28">
        <div className="px-5 mt-2">
          <div className="rounded-2xl bg-warn-bg px-4 py-3">
            <p className="text-sm font-semibold text-warn">
              Mulig dobbeltforsikring oppdaget
            </p>
            <p className="text-xs text-warn/80 mt-0.5">
              Reiseforsikring i Gjensidige overlapper med Visa Infinite.
            </p>
          </div>
        </div>

        <SectionHeader title="Dine forsikringer" />

        <div className="px-5">
          <Card>
            {policies.map((p) => (
              <CardRow key={p.id}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {p.warn && (
                      <span
                        className="shrink-0 rounded-full bg-warn"
                        style={{ width: 8, height: 8 }}
                      />
                    )}
                    <span className={`text-sm font-semibold ${p.warn ? 'text-warn' : 'text-ink'}`}>
                      {p.name}
                    </span>
                  </div>
                  <p className="text-xs text-ink-3 mt-0.5 ml-0">
                    {p.provider}
                  </p>
                </div>
                <span className="text-sm font-semibold text-ink tabular-nums whitespace-nowrap">
                  {formatNOK(p.monthly)}/mnd
                </span>
              </CardRow>
            ))}
          </Card>
          <div className="mt-2">
            <DataSourceTag variant="document" />
          </div>
        </div>

        <SectionHeader title="Anbefaling" />

        <div className="px-5">
          <Card className="p-5">
            <p className="text-sm text-ink leading-snug">
              Si opp reiseforsikring i Gjensidige – du er dekket via Visa
              Infinite.
            </p>
            <div className="mt-3">
              <EpistemiskBadge variant="data-document" />
            </div>
          </Card>
        </div>

        <div className="px-5 mt-6">
          <Button variant="secondary">Sammenlign alternativer</Button>
        </div>
      </div>
    </div>
  )
}
