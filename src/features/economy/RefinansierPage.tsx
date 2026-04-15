import { TopNav } from '@/components/layout/TopNav'
import { SectionHeader } from '@/components/layout/SectionHeader'
import { Card, CardRow } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ProgressSteps } from '@/components/ui/ProgressSteps'
import { formatNOK } from '@/lib/format'

const providers = [
  { name: 'Bulder Bank', rate: 4.6 },
  { name: 'Nordea', rate: 4.8 },
  { name: 'Handelsbanken', rate: 4.9 },
]

const steps = [
  { label: 'Sjekk dagens vilkår', description: 'DNB 5,8 % bekreftet', status: 'done' as const },
  { label: 'Sammenlign tilbud', description: '3 tilbud hentet', status: 'active' as const },
  { label: 'Send søknad', description: 'Velg tilbyder', status: 'pending' as const },
  { label: 'Signer avtale', description: 'BankID-signering', status: 'pending' as const },
]

export function RefinansierPage() {
  return (
    <div className="flex flex-col min-h-screen bg-surface-2">
      <TopNav title="Refinansiering" showBack />

      <div className="flex-1 overflow-y-auto pb-28">
        <div className="px-5 mt-2">
          <Card className="p-5 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-ink-3">Dagens rente (DNB)</span>
              <span className="font-semibold text-ink">5,8 %</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink-3">Beste tilbud</span>
              <span className="font-semibold text-ok">4,6 %</span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t border-border">
              <span className="font-semibold text-ok">Mulig besparelse</span>
              <span className="font-bold text-ok tabular-nums">
                {formatNOK(2400)}/mnd
              </span>
            </div>
          </Card>
        </div>

        <SectionHeader title="Fremdrift" />

        <div className="px-5">
          <Card className="p-5">
            <ProgressSteps steps={steps} />
          </Card>
        </div>

        <SectionHeader title="Tilbud" />

        <div className="px-5">
          <Card>
            {providers.map((p) => (
              <CardRow key={p.name}>
                <div>
                  <p className="text-sm font-semibold text-ink">{p.name}</p>
                </div>
                <span
                  className={`text-sm font-bold tabular-nums ${p.rate === 4.6 ? 'text-ok' : 'text-ink'}`}
                >
                  {p.rate.toFixed(1)} %
                </span>
              </CardRow>
            ))}
          </Card>
        </div>

        <div className="px-5 mt-6">
          <Button>Start søknad</Button>
        </div>
      </div>
    </div>
  )
}
