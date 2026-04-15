interface GoalCardProps {
  name: string
  icon: string
  target: number
  current: number
  deadline: string
  monthsLeft: number
  onClick?: () => void
}

function formatNOK(n: number): string {
  return n.toLocaleString('nb-NO')
}

export function GoalCard({ name, icon, target, current, deadline, monthsLeft, onClick }: GoalCardProps) {
  const pct = Math.min(Math.round((current / target) * 100), 100)

  return (
    <div
      className={`bg-surface rounded-3 border border-border shadow-sm shadow-black/4 p-5 space-y-4 ${onClick ? 'cursor-pointer active:scale-[0.99] transition-transform' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <span className="text-base font-semibold text-ink">{name}</span>
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-bold text-ink">{formatNOK(current)}</span>
        <span className="text-sm text-ink-3">/ {formatNOK(target)} kr</span>
      </div>

      <div className="space-y-2">
        <div className="relative w-full" style={{ height: 6 }}>
          <div className="absolute inset-0 rounded-full bg-surface-3" />
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-accent transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="flex justify-between text-xs text-ink-3">
          <span>{pct}% spart</span>
          <span>{monthsLeft} mnd igjen – {deadline}</span>
        </div>
      </div>
    </div>
  )
}
