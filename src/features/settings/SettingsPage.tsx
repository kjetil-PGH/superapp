import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopNav } from '@/components/layout/TopNav'
import { Card, CardRow } from '@/components/ui/Card'
import { SectionHeader } from '@/components/layout/SectionHeader'
import { Button } from '@/components/ui/Button'
import { isFullyConnected, getConnectionInfo, clearConnection, checkHealth } from '@/lib/api'

export function SettingsPage() {
  const navigate = useNavigate()
  const connected = isFullyConnected()
  const connection = getConnectionInfo()
  const [backendOk, setBackendOk] = useState<boolean | null>(null)

  useEffect(() => {
    checkHealth().then(h => setBackendOk(h.ok && h.configured))
  }, [])

  function handleDisconnect() {
    clearConnection()
    window.location.reload()
  }

  return (
    <div className="pb-4">
      <TopNav title="Innstillinger" />

      <SectionHeader title="Banktilkobling" />
      <div className="mx-4 mb-4">
        <Card>
          <CardRow>
            <div>
              <div className="text-base text-ink">Neonomics (PSD2)</div>
              <div className="text-sm text-ink-3 mt-0.5">Kontotransaksjoner</div>
            </div>
            {connected ? (
              <span className="text-sm font-semibold text-ok">Tilkoblet</span>
            ) : (
              <span className="text-sm font-semibold text-ink-3">Ikke tilkoblet</span>
            )}
          </CardRow>
          {connected && connection && (
            <CardRow>
              <div>
                <div className="text-base text-ink">{connection.bankName}</div>
                <div className="text-sm text-ink-3 mt-0.5">
                  Tilkoblet {new Date(connection.connectedAt).toLocaleDateString('nb-NO')}
                </div>
              </div>
            </CardRow>
          )}
          <CardRow>
            <div>
              <div className="text-base text-ink">API-server</div>
              <div className="text-sm text-ink-3 mt-0.5">Backend-tilkobling</div>
            </div>
            {backendOk === null ? (
              <span className="text-sm text-ink-3">Sjekker...</span>
            ) : backendOk ? (
              <span className="text-sm font-semibold text-ok">Aktiv</span>
            ) : (
              <span className="text-sm font-semibold text-accent">Ikke tilgjengelig</span>
            )}
          </CardRow>
        </Card>
      </div>

      <div className="mx-4 mb-5">
        {connected ? (
          <Button variant="secondary" onClick={handleDisconnect}>
            Koble fra bank
          </Button>
        ) : (
          <Button onClick={() => navigate('/connect')}>
            Koble til bank
          </Button>
        )}
      </div>

      <SectionHeader title="Data" />
      <div className="mx-4 mb-4">
        <Card>
          <CardRow>
            <div>
              <div className="text-base text-ink">Abonnement-deteksjon</div>
              <div className="text-sm text-ink-3 mt-0.5">Basert på transaksjonsmønster</div>
            </div>
            <span className="text-sm font-semibold text-ok">Aktiv</span>
          </CardRow>
          <CardRow>
            <span className="text-sm text-ink-2">Datakilde</span>
            <span className="text-sm font-semibold text-ink">{connected ? 'Banktransaksjoner' : 'Ikke tilkoblet'}</span>
          </CardRow>
        </Card>
      </div>

      <SectionHeader title="Om" />
      <div className="mx-4 mb-4">
        <Card>
          <CardRow>
            <span className="text-sm text-ink-2">Versjon</span>
            <span className="text-sm font-semibold text-ink">MVP 1.0</span>
          </CardRow>
          <CardRow>
            <span className="text-sm text-ink-2">Stack</span>
            <span className="text-sm font-semibold text-ink">Vite + React + TS</span>
          </CardRow>
        </Card>
      </div>

      <div className="px-4 text-center text-sm text-ink-3 leading-relaxed mt-4">
        Din data deles aldri med tredjeparter.<br />
        Sikret med PSD2 via Neonomics.
      </div>
    </div>
  )
}
