import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopNav } from '@/components/layout/TopNav'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { BankSelector } from './components/BankSelector'
import { ConsentStep } from './components/ConsentStep'
import {
  checkHealth,
  getBanks,
  createSession,
  getAccounts,
  requestConsent,
  saveConnection,
  saveAccounts,
  clearConnection,
  isFullyConnected,
  type Bank,
  type HealthStatus,
  type ConsentNeeded,
} from '@/lib/api'

type Step = 'check' | 'select-bank' | 'psu-id' | 'connecting' | 'consent' | 'fetching' | 'success' | 'error'

export function ConnectPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('check')
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [banks, setBanks] = useState<Bank[]>([])
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null)
  const [psuId, setPsuId] = useState('')
  const [consentUrl, setConsentUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkHealth().then(h => {
      setHealth(h)
      if (h.ok && h.configured) {
        if (isFullyConnected()) {
          setStep('success')
        } else {
          loadBanks(h)
        }
      }
    })
  }, [])

  async function loadBanks(h?: HealthStatus) {
    try {
      const list = await getBanks()
      const hasEncryption = h?.encryptionKey ?? health?.encryptionKey ?? false
      const available = (list as Bank[]).filter(
        (b: Bank) => b.status === 'AVAILABLE'
          && b.supportedServices?.includes('accounts')
          && (hasEncryption || !b.personalIdentificationRequired),
      )
      setBanks(available)
      setStep('select-bank')
    } catch (e) {
      setError((e as Error).message)
      setStep('error')
    }
  }

  function handleBankSelect(bank: Bank) {
    setSelectedBank(bank)
    if (bank.personalIdentificationRequired) {
      setPsuId('')
      setStep('psu-id')
    } else {
      connectToBank(bank, undefined)
    }
  }

  function handlePsuIdSubmit() {
    if (!selectedBank || !psuId.trim()) return
    connectToBank(selectedBank, psuId.trim())
  }

  async function connectToBank(bank: Bank, personalId: string | undefined) {
    setStep('connecting')
    setError(null)
    clearConnection()

    try {
      const deviceId = `superapp-${crypto.randomUUID().slice(0, 8)}`
      localStorage.setItem('neo_device_id', deviceId)

      const session = await createSession(bank.id)
      const sessionId = (session as { sessionId: string }).sessionId
      saveConnection(sessionId, deviceId, bank.bankDisplayName)

      const accountsResult = await getAccounts()

      if (isConsentNeeded(accountsResult)) {
        const consentLink = accountsResult.consentData.links?.[0]?.href
        if (!consentLink) throw new Error('No consent link in response')

        const consentResponse = await requestConsent(consentLink, personalId)
        const bankAuthUrl = consentResponse.links?.[0]?.href
        if (!bankAuthUrl) throw new Error('No bank auth URL in consent response')

        setConsentUrl(bankAuthUrl)
        setStep('consent')
        return
      }

      if (Array.isArray(accountsResult) && accountsResult.length > 0) {
        saveAccounts(accountsResult)
        setStep('success')
        return
      }

      throw new Error('Ingen kontoer funnet hos denne banken')
    } catch (e) {
      setError((e as Error).message)
      setStep('error')
    }
  }

  async function handleConsentComplete() {
    setStep('fetching')
    setError(null)

    try {
      const accountsResult = await getAccounts()

      if (isConsentNeeded(accountsResult)) {
        setError('Samtykket ser ikke ut til å være fullført. Prøv å åpne bankens pålogging på nytt.')
        setStep('consent')
        return
      }

      if (Array.isArray(accountsResult) && accountsResult.length > 0) {
        saveAccounts(accountsResult)
        setStep('success')
        return
      }

      throw new Error('Ingen kontoer funnet. Prøv igjen.')
    } catch (e) {
      setError((e as Error).message)
      setStep('error')
    }
  }

  function startOver() {
    clearConnection()
    setError(null)
    setSelectedBank(null)
    setConsentUrl(null)
    setPsuId('')
    loadBanks()
  }

  if (!health) {
    return (
      <div className="pb-4">
        <TopNav title="Koble bank" showBack />
        <div className="flex items-center justify-center py-20">
          <div className="text-ink-3 text-sm">Sjekker tilkobling...</div>
        </div>
      </div>
    )
  }

  if (!health.ok || !health.configured) {
    return (
      <div className="pb-4">
        <TopNav title="Koble bank" showBack />
        <div className="mx-4 mt-6">
          <Card className="p-6 text-center">
            <div className="text-3xl mb-3">🔌</div>
            <div className="text-lg font-semibold text-ink mb-2">Backend ikke tilkoblet</div>
            <div className="text-sm text-ink-3 leading-relaxed mb-4">
              Sjekk at API-serveren kjører og at <code className="bg-surface-3 px-1.5 py-0.5 rounded text-xs">.env</code> har
              gyldig Neonomics-legitimasjon.
            </div>
            <Button variant="secondary" onClick={() => navigate('/settings')}>
              Gå til innstillinger
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-4">
      <TopNav title="Koble bank" showBack />

      {step === 'select-bank' && (
        <BankSelector banks={banks} onSelect={handleBankSelect} />
      )}

      {step === 'psu-id' && (
        <div className="mx-4 mt-6">
          <Card className="p-6">
            <div className="text-center mb-5">
              <div className="text-3xl mb-3">🔑</div>
              <div className="text-lg font-semibold text-ink mb-2">Identifikasjon kreves</div>
              <div className="text-sm text-ink-3 leading-relaxed">
                {selectedBank?.bankDisplayName} krever fødselsnummer for å opprette tilkobling.
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-ink-2 mb-1.5">Fødselsnummer</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="11 siffer"
                value={psuId}
                onChange={e => setPsuId(e.target.value.replace(/\D/g, '').slice(0, 11))}
                className="w-full px-4 py-3 bg-surface-2 border border-border rounded-xl text-base text-ink placeholder:text-ink-4 focus:outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent/10"
              />
            </div>
            <Button onClick={handlePsuIdSubmit} disabled={psuId.length !== 11}>
              Fortsett
            </Button>
            <div className="text-center text-xs text-ink-4 mt-3 leading-relaxed">
              Sandbox: DNB bruk <span className="font-mono">31125461118</span>
            </div>
          </Card>
        </div>
      )}

      {(step === 'connecting' || step === 'fetching') && (
        <div className="mx-4 mt-6">
          <Card className="p-8 text-center">
            <div className="animate-spin w-10 h-10 border-3 border-accent/20 border-t-accent rounded-full mx-auto mb-4" />
            <div className="text-base font-semibold text-ink mb-1">
              {step === 'fetching' ? 'Henter kontoer...' : `Kobler til ${selectedBank?.bankDisplayName ?? 'bank'}...`}
            </div>
            <div className="text-sm text-ink-3">
              {step === 'fetching' ? 'Bekrefter samtykke med banken' : 'Oppretter sikker tilkobling'}
            </div>
          </Card>
        </div>
      )}

      {step === 'consent' && consentUrl && (
        <>
          {error && (
            <div className="mx-4 mt-4 mb-2 bg-warn-bg text-warn text-sm p-3 rounded-xl font-medium">
              {error}
            </div>
          )}
          <ConsentStep
            bankName={selectedBank?.bankDisplayName || 'banken'}
            consentUrl={consentUrl}
            onComplete={handleConsentComplete}
          />
        </>
      )}

      {step === 'success' && (
        <div className="mx-4 mt-6">
          <Card className="p-8 text-center">
            <div className="text-3xl mb-3">✓</div>
            <div className="text-lg font-semibold text-ink mb-1">
              {selectedBank?.bankDisplayName || 'Bank'} er tilkoblet
            </div>
            <div className="text-sm text-ink-3 mb-6">
              Vi kan nå lese kontoinformasjon og transaksjoner
            </div>
            <Button onClick={() => navigate('/')}>
              Gå til oversikten
            </Button>
          </Card>
        </div>
      )}

      {step === 'error' && (
        <div className="mx-4 mt-6">
          <Card className="p-6 text-center">
            <div className="text-3xl mb-3">⚠</div>
            <div className="text-lg font-semibold text-ink mb-2">Noe gikk galt</div>
            <div className="text-sm text-ink-3 leading-relaxed mb-4">
              {error || 'Kunne ikke koble til banken.'}
            </div>
            <Button onClick={startOver}>
              Prøv igjen
            </Button>
          </Card>
        </div>
      )}
    </div>
  )
}

function isConsentNeeded(result: unknown): result is ConsentNeeded {
  return result !== null && typeof result === 'object' && 'needsConsent' in (result as Record<string, unknown>)
}
