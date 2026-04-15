interface CategoryBarProps {
  value: number
  max: number
  normal?: number
  color?: 'accent' | 'ok' | 'warn' | 'err'
}

const fillColors = {
  accent: 'bg-accent',
  ok: 'bg-ok',
  warn: 'bg-warn',
  err: 'bg-err',
}

export function CategoryBar({ value, max, normal, color = 'accent' }: CategoryBarProps) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100)
  const normalPct = normal != null ? Math.min(Math.max((normal / max) * 100, 0), 100) : null

  return (
    <div className="relative w-full" style={{ height: 6 }}>
      <div className="absolute inset-0 rounded-full bg-surface-3" />
      <div
        className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${fillColors[color]}`}
        style={{ width: `${pct}%` }}
      />
      {normalPct != null && (
        <div
          className="absolute top-[-2px] bottom-[-2px] w-[2px] rounded-full bg-ink"
          style={{ left: `${normalPct}%` }}
        />
      )}
    </div>
  )
}
