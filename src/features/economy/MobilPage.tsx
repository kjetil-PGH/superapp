import { TopNav } from '@/components/layout/TopNav'
import { SectionHeader } from '@/components/layout/SectionHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { DataSourceTag } from '@/components/ui/DataSourceTag'
import { ProgressSteps } from '@/components/ui/ProgressSteps'
import { formatNOK } from '@/lib/format'

const steps = [
  { label: 'Velg plan', description: 'Sammenlign tilbud', status: 'active' as const },
  { label: 'Bestill', description: 'Nettbestilling', status: 'pending' as const },
  { label: 'Bytt SIM', description: 'Motta nytt SIM-kort', status: 'pending' as const },
  { label: 'Ferdig', description: 'Ny plan aktiv', status: 'pending' as const },
]

export function MobilPage() {
  return (
    <div className="flex flex-col min-h-screen bg-surface-2">
      <TopNav title="Mobil og internett" showBack />

      <div className="flex-1 overflow-y-auto pb-28">
        <SectionHeader title="Ditt mobilabonnement" />

        <div className="px-5">
          <Card className="p-5 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-ink-3">Operatør</span>
              <span className="font-semibold text-ink">Telia</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink-3">Data</span>
              <span className="font-semibold text-ink">40 GB</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink-3">Pris</span>
              <span className="font-semibold text-ink tabular-nums">
                {formatNOK(449)}/mnd
              </span>
            </div>
            <div className="pt-1">
              <DataSourceTag variant="auto" />
            </div>
          </Card>
        </div>

        <SectionHeader title="Bruksanalyse" />

        <div className="px-5">
          <Card className="p-5">
            <p className="text-sm text-ink leading-snug">
              Du bruker i snitt <strong>12 GB/mnd</strong> – betaler for{' '}
              <strong>40 GB</strong>.
            </p>
          </Card>
        </div>

        <SectionHeader title="Anbefalt plan" />

        <div className="px-5">
          <Card className="p-5 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-ink-3">Talkmore 15 GB</span>
              <span className="font-semibold text-ink tabular-nums">
                {formatNOK(299)}/mnd
              </span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t border-border">
              <span className="font-semibold text-ok">Besparelse</span>
              <span className="font-bold text-ok tabular-nums">
                {formatNOK(150)}/mnd
              </span>
            </div>
          </Card>
        </div>

        <SectionHeader title="Internett" />

        <div className="px-5">
          <Card className="p-5 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-ink-3">Telenor 100/100 Mbit</span>
              <span className="font-semibold text-ink tabular-nums">
                {formatNOK(599)}/mnd
              </span>
            </div>
          </Card>
        </div>

        <div className="px-5 mt-5">
          <Button
            variant="secondary"
            onClick={() => alert('Quiz kommer snart!')}
          >
            Usikker på hva du trenger?
          </Button>
        </div>

        <SectionHeader title="Bytteprosess" />

        <div className="px-5">
          <Card className="p-5">
            <ProgressSteps steps={steps} />
          </Card>
        </div>
      </div>
    </div>
  )
}
