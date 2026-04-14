import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface Props {
  bankName: string
  consentUrl: string
  onComplete: () => void
}

export function ConsentStep({ bankName, consentUrl, onComplete }: Props) {
  function openConsent() {
    window.open(consentUrl, '_blank', 'noopener')
  }

  return (
    <div className="mx-4 mt-6">
      <Card className="p-6">
        <div className="text-center mb-5">
          <div className="text-3xl mb-3">🔐</div>
          <div className="text-lg font-semibold text-ink mb-2">Gi samtykke</div>
          <div className="text-sm text-ink-3 leading-relaxed">
            {bankName} krever at du gir samtykke til å dele kontoinformasjon.
            Du vil bli videresendt til bankens sikre påloggingsside i en ny fane.
          </div>
        </div>

        <div className="bg-accent-light rounded-[16px] p-4 mb-5">
          <div className="text-sm font-semibold text-accent-dark mb-2">Vi ber om tilgang til:</div>
          <ul className="text-sm text-ink-2 space-y-1.5">
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">✓</span>
              <span>Kontoinformasjon og saldo</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">✓</span>
              <span>Transaksjonshistorikk (siste 6 måneder)</span>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <Button onClick={openConsent}>
            Åpne bankens pålogging
          </Button>
          <Button variant="secondary" onClick={onComplete}>
            Jeg har gitt samtykke
          </Button>
        </div>

        <div className="text-center text-xs text-ink-3 mt-4 leading-relaxed">
          Etter pålogging hos banken vil du automatisk sendes<br />
          tilbake hit. Vi lagrer aldri dine innloggingsdetaljer.
        </div>
      </Card>
    </div>
  )
}
