import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { hasSession, getAccounts, saveAccounts, isFullyConnected, getConnectionInfo } from '@/lib/api'

export function ConnectCallbackPage() {
  const navigate = useNavigate()
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    completeConsent()
  }, [])

  async function completeConsent() {
    if (!hasSession()) {
      setErrorMsg('Ingen aktiv sesjon funnet.')
      setStatus('error')
      return
    }

    try {
      const result = await getAccounts()
      if (Array.isArray(result) && result.length > 0) {
        saveAccounts(result)
        setStatus('success')
        return
      }

      if (result && typeof result === 'object' && 'needsConsent' in result) {
        setErrorMsg('Samtykket ser ikke ut til å ha blitt registrert av banken. Prøv igjen.')
        setStatus('error')
        return
      }

      setErrorMsg('Ingen kontoer funnet hos banken.')
      setStatus('error')
    } catch (e) {
      setErrorMsg((e as Error).message)
      setStatus('error')
    }
  }

  const bankName = getConnectionInfo()?.bankName || 'Banken'

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-2 p-4">
      <Card className="p-8 text-center max-w-sm w-full">
        {status === 'verifying' && (
          <>
            <div className="animate-spin w-10 h-10 border-3 border-accent/20 border-t-accent rounded-full mx-auto mb-4" />
            <div className="text-base font-semibold text-ink">Henter kontoer...</div>
            <div className="text-sm text-ink-3 mt-1">Bekrefter samtykke med {bankName}</div>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-3xl mb-3">✓</div>
            <div className="text-lg font-semibold text-ink mb-2">{bankName} er tilkoblet</div>
            <div className="text-sm text-ink-3 mb-6">Kontoer og transaksjoner er klare.</div>
            <Button onClick={() => navigate('/')}>
              Gå til oversikten
            </Button>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-3xl mb-3">⚠</div>
            <div className="text-lg font-semibold text-ink mb-2">Noe gikk galt</div>
            <div className="text-sm text-ink-3 mb-6">{errorMsg || 'Prøv igjen.'}</div>
            <Button onClick={() => navigate('/connect')}>
              Prøv igjen
            </Button>
          </>
        )}
      </Card>
    </div>
  )
}
