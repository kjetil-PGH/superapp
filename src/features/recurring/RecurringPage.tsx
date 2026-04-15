import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTransactions } from '@/lib/useTransactions'
import { detectRecurring } from '@/lib/recurring-detection'
import { buildRecurringSummary } from '@/lib/insights'
import { formatNOK, categoryLabel } from '@/lib/format'
import { TopNav } from '@/components/layout/TopNav'
import { SectionHeader } from '@/components/layout/SectionHeader'
import { MetricCard } from '@/components/ui/MetricCard'
import { MerchantLogo } from '@/components/ui/MerchantLogo'
import { ExpandablePanel } from '@/components/ui/ExpandablePanel'
import { ConnectBankPrompt } from '@/components/ui/ConnectBankPrompt'
import { Button } from '@/components/ui/Button'
import type { RecurringExpense, ExpenseCategory } from '@/types/domain'

const cancellationGuides: Record<string, { steps: string[]; url?: string }> = {
  'Netflix': {
    steps: ['Gå til netflix.com/account', 'Klikk "Avbryt medlemskap"', 'Bekreft avbestillingen', 'Du beholder tilgang til slutten av perioden'],
    url: 'https://netflix.com/account',
  },
  'Spotify': {
    steps: ['Gå til spotify.com/account', 'Klikk "Endre abonnement"', 'Velg "Avbryt Spotify Premium"', 'Bekreft oppsigelsen'],
    url: 'https://spotify.com/account',
  },
  'YouTube Premium': {
    steps: ['Gå til youtube.com/paid_memberships', 'Klikk "Administrer medlemskap"', 'Velg "Deaktiver"', 'Bekreft oppsigelsen'],
  },
  'HBO Max': {
    steps: ['Gå til play.hbomax.com/settings/subscription', 'Klikk "Administrer abonnement"', 'Velg "Si opp abonnement"'],
  },
  'Disney+': {
    steps: ['Gå til disneyplus.com/account', 'Klikk på abonnementet ditt', 'Velg "Si opp abonnement"', 'Bekreft'],
  },
  'Viaplay': {
    steps: ['Logg inn på viaplay.no', 'Gå til "Min konto"', 'Velg "Si opp abonnement"'],
  },
  'Storytel': {
    steps: ['Åpne Storytel-appen', 'Gå til Profil → Abonnement', 'Trykk "Si opp"', 'Bekreft oppsigelsen'],
  },
  'ChatGPT': {
    steps: ['Gå til chat.openai.com', 'Klikk profilikonet → Settings', 'Velg "Manage subscription"', 'Klikk "Cancel plan"'],
  },
  'Evo Fitness': {
    steps: ['Send e-post til kundeservice@evofitness.no', 'Oppgi medlemsnummer og navn', 'Be om oppsigelse', 'Oppsigelsestid: 1 måned'],
  },
}

function GroupedSubscriptions({
  category,
  expenses,
}: {
  category: ExpenseCategory
  expenses: RecurringExpense[]
}) {
  const navigate = useNavigate()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [confirming, setConfirming] = useState<string | null>(null)

  const total = expenses.reduce((s, e) => s + e.monthlyAmount, 0)

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between px-5 py-2">
        <span className="text-sm font-bold text-ink-3 uppercase tracking-wider">
          {categoryLabel(category)}
        </span>
        <span className="text-sm font-semibold text-ink-3">{formatNOK(total)}/mnd</span>
      </div>
      <div className="mx-4 bg-surface rounded-[20px] shadow-sm shadow-black/4 overflow-hidden">
        {expenses.map((exp, i) => {
          const isExpanded = expandedId === exp.id
          const guide = cancellationGuides[exp.merchant]
          const isConfirming = confirming === exp.id

          return (
            <div key={exp.id}>
              <div
                className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer active:bg-surface-2 transition-colors ${
                  i < expenses.length - 1 && !isExpanded ? 'border-b border-border' : ''
                }`}
                onClick={() => setExpandedId(isExpanded ? null : exp.id)}
              >
                <MerchantLogo name={exp.merchant} size={40} />
                <div className="flex-1 min-w-0">
                  <div className="text-base font-semibold text-ink">{exp.merchant}</div>
                  <div className="text-sm text-ink-3 mt-0.5">
                    {exp.occurrences} belastninger
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-base font-bold text-ink">{formatNOK(exp.monthlyAmount)}</div>
                  <div className="text-xs text-ink-3">/mnd</div>
                </div>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 14 14"
                  fill="none"
                  className={`shrink-0 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                >
                  <path d="M5 3l4 4-4 4" stroke="#BFBFBF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <ExpandablePanel isOpen={isExpanded}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-sm text-ink-2">Per år</div>
                    <div className="text-lg font-bold text-ink">{formatNOK(exp.yearlyAmount)}</div>
                  </div>
                  <button
                    onClick={() => navigate(`/recurring/${exp.id}`)}
                    className="text-sm font-semibold text-accent"
                  >
                    Se detaljer ›
                  </button>
                </div>

                {guide && (
                  <div className="mt-3">
                    <div className="text-sm font-bold text-ink mb-2">Slik sier du opp</div>
                    <ol className="space-y-2">
                      {guide.steps.map((step, si) => (
                        <li key={si} className="flex gap-2 text-sm text-ink-2">
                          <span className="w-5 h-5 rounded-full bg-accent-light text-accent text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {si + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                    {guide.url && (
                      <a
                        href={guide.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 text-sm font-semibold text-accent"
                      >
                        Gå til {exp.merchant} ›
                      </a>
                    )}
                  </div>
                )}

                <div className="mt-4">
                  {isConfirming ? (
                    <div className="bg-ok-bg rounded-xl p-4 text-center">
                      <div className="text-base font-bold text-ok mb-1">Har du sagt opp?</div>
                      <div className="text-sm text-ink-2 mb-3">
                        Bekreft at du har sagt opp {exp.merchant}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="primary"
                          fullWidth={false}
                          className="flex-1 bg-ok! py-2.5! text-sm!"
                          onClick={() => setConfirming(null)}
                        >
                          Ja, oppsagt
                        </Button>
                        <Button
                          variant="secondary"
                          fullWidth={false}
                          className="flex-1 py-2.5! text-sm!"
                          onClick={() => setConfirming(null)}
                        >
                          Ikke ennå
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirming(exp.id)}
                      className="w-full py-2.5 rounded-xl bg-err-bg text-err text-sm font-semibold"
                    >
                      Marker som oppsagt
                    </button>
                  )}
                </div>
              </ExpandablePanel>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function RecurringPage() {
  const [filter, setFilter] = useState<ExpenseCategory | 'all'>('all')
  const { transactions, loading, connected } = useTransactions()

  const summary = useMemo(() => {
    const expenses = detectRecurring(transactions)
    return buildRecurringSummary(expenses)
  }, [transactions])

  const filtered = filter === 'all'
    ? summary.expenses
    : summary.expenses.filter(e => e.category === filter)

  const grouped = useMemo(() => {
    const groups = new Map<ExpenseCategory, RecurringExpense[]>()
    for (const exp of filtered) {
      const existing = groups.get(exp.category) || []
      existing.push(exp)
      groups.set(exp.category, existing)
    }
    return Array.from(groups.entries()).sort(
      (a, b) => b[1].reduce((s, e) => s + e.monthlyAmount, 0) - a[1].reduce((s, e) => s + e.monthlyAmount, 0)
    )
  }, [filtered])

  const categories = useMemo(() => {
    const cats = new Set(summary.expenses.map(e => e.category))
    return Array.from(cats)
  }, [summary.expenses])

  const filterOptions: { key: ExpenseCategory | 'all'; label: string }[] = [
    { key: 'all', label: 'Alle' },
    ...categories.map(c => ({ key: c, label: categoryLabel(c) })),
  ]

  return (
    <div className="pb-4">
      <TopNav title="Faste utgifter" />

      {!connected ? (
        <ConnectBankPrompt description="Koble til banken din for å se faste utgifter og abonnementer." />
      ) : loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-3 border-accent/20 border-t-accent rounded-full" />
        </div>
      ) : transactions.length === 0 ? (
        <ConnectBankPrompt
          title="Ingen transaksjoner"
          description="Vi fant ingen transaksjoner. Sjekk at samtykket er fullført."
        />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2.5 mx-4 mb-4">
            <MetricCard
              label="Totalt per måned"
              value={formatNOK(summary.totalMonthly)}
            />
            <MetricCard
              label="Totalt per år"
              value={formatNOK(summary.totalYearly)}
              valueColor="text-ink"
            />
          </div>

          <div className="flex gap-2 px-4 mb-4 overflow-x-auto no-scrollbar">
            {filterOptions.map(opt => (
              <button
                key={opt.key}
                onClick={() => setFilter(opt.key)}
                className={`text-sm font-semibold px-4 py-1.5 rounded-full transition-colors whitespace-nowrap ${
                  filter === opt.key
                    ? 'bg-ink text-white'
                    : 'bg-surface text-ink-3 shadow-sm shadow-black/4'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <SectionHeader title={`${filtered.length} abonnementer`} />

          {grouped.map(([category, expenses]) => (
            <GroupedSubscriptions
              key={category}
              category={category}
              expenses={expenses}
            />
          ))}

          {filtered.length === 0 && (
            <div className="mx-4 px-4 py-8 text-center text-ink-3 text-sm bg-surface rounded-[20px]">
              Ingen abonnementer i denne kategorien
            </div>
          )}
        </>
      )}
    </div>
  )
}
