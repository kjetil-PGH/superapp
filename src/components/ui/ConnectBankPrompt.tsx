import { useNavigate } from 'react-router-dom'
import { Button } from './Button'

interface Props {
  title?: string
  description?: string
}

export function ConnectBankPrompt({
  title = 'Koble til banken din',
  description = 'For å se utgifter og innsikt trenger vi tilgang til transaksjonene dine via Neonomics.',
}: Props) {
  const navigate = useNavigate()

  return (
    <div className="mx-4 mt-8 mb-4">
      <div className="bg-surface rounded-[24px] shadow-sm shadow-black/[0.04] p-8 text-center">
        <div className="text-3xl mb-4">🏦</div>
        <div className="text-lg font-bold text-ink mb-2">{title}</div>
        <div className="text-base text-ink-3 leading-relaxed mb-6 max-w-[280px] mx-auto">
          {description}
        </div>
        <Button onClick={() => navigate('/connect')}>
          Koble til bank
        </Button>
      </div>
    </div>
  )
}
