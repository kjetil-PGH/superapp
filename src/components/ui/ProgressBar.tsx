interface ProgressBarProps {
  value: number
  max?: number
  variant?: 'accent' | 'ok' | 'warn' | 'err'
  height?: number
  className?: string
}

export function ProgressBar({ value, max = 100, variant = 'accent', height = 5, className = '' }: ProgressBarProps) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100)
  const colors = {
    accent: 'bg-accent',
    ok: 'bg-ok',
    warn: 'bg-warn',
    err: 'bg-err',
  }
  return (
    <div className={`bg-surface-3 rounded-full overflow-hidden ${className}`} style={{ height }}>
      <div
        className={`h-full rounded-full transition-all duration-500 ${colors[variant]}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
