interface MetricCardProps {
  label: string
  value: string
  sub?: string
  valueColor?: string
  onClick?: () => void
}

export function MetricCard({ label, value, sub, valueColor, onClick }: MetricCardProps) {
  return (
    <div
      className={`bg-surface rounded-[20px] shadow-sm shadow-black/[0.04] p-4 ${onClick ? 'cursor-pointer active:scale-[0.98] transition-transform' : ''}`}
      onClick={onClick}
    >
      <div className="text-xs font-semibold text-ink-3 uppercase tracking-wider mb-1.5">{label}</div>
      <div className={`text-xl font-bold tracking-tight leading-tight ${valueColor ?? 'text-ink'}`}>{value}</div>
      {sub && <div className={`text-sm mt-1 ${valueColor ?? 'text-ink-3'}`}>{sub}</div>}
    </div>
  )
}
