import { TopNav } from '@/components/layout/TopNav'
import { SectionHeader } from '@/components/layout/SectionHeader'
import { Card } from '@/components/ui/Card'
import { EpistemiskBadge } from '@/components/ui/EpistemiskBadge'
import { DataSourceTag } from '@/components/ui/DataSourceTag'
import { formatNOK } from '@/lib/format'

const tips = [
  'Ring 04800 og be om å snakke med låneavdelingen',
  'Si: Jeg har fått tilbud fra Bulder Bank på 4,6 %',
  'Spør: Kan dere matche dette?',
  'Hvis nei: Be om skriftlig avslag',
]

export function ForhandlePage() {
  return (
    <div className="flex flex-col min-h-screen bg-surface-2">
      <TopNav title="Forhandle med DNB" showBack />

      <div className="flex-1 overflow-y-auto pb-28">
        <div className="px-5 mt-2">
          <Card className="p-5 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-ink-3">Dagens rente</span>
              <span className="font-semibold text-ink">5,8 %</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink-3">Gjenstående</span>
              <span className="font-semibold text-ink tabular-nums">
                {formatNOK(2050000)}
              </span>
            </div>
          </Card>
        </div>

        <SectionHeader title="Forhandlingsscript" />

        <div className="px-5">
          <Card className="p-5 space-y-4">
            {tips.map((tip, i) => (
              <div key={i} className="flex gap-3">
                <span
                  className="shrink-0 flex items-center justify-center rounded-full bg-accent text-white text-xs font-bold"
                  style={{ width: 24, height: 24 }}
                >
                  {i + 1}
                </span>
                <p className="text-sm text-ink leading-snug pt-0.5">{tip}</p>
              </div>
            ))}
          </Card>
        </div>

        <div className="px-5 mt-5 flex flex-wrap gap-2">
          <EpistemiskBadge variant="effect-high" />
          <EpistemiskBadge variant="effort-medium" />
        </div>

        <div className="px-5 mt-3">
          <DataSourceTag variant="auto" label="Gjeldsregisteret + markedsdata" />
        </div>
      </div>
    </div>
  )
}
