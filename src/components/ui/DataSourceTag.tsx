interface DataSourceTagProps {
  variant: 'auto' | 'document' | 'assumed'
  label?: string
}

const config: Record<DataSourceTagProps['variant'], { bg: string; text: string; dot: string; defaultLabel: string }> = {
  auto:     { bg: 'bg-ok-bg',        text: 'text-ok',    dot: 'bg-ok',    defaultLabel: 'Automatisk oppdaget' },
  document: { bg: 'bg-accent-light', text: 'text-accent', dot: 'bg-accent', defaultLabel: 'Bekreftet av dokument' },
  assumed:  { bg: 'bg-surface-3',    text: 'text-ink-3', dot: 'bg-ink-3', defaultLabel: 'Antatt basert på mønster' },
}

export function DataSourceTag({ variant, label }: DataSourceTagProps) {
  const { bg, text, dot, defaultLabel } = config[variant]

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ${bg} ${text}`}>
      <span className={`shrink-0 rounded-full ${dot}`} style={{ width: 4, height: 4 }} />
      {label ?? defaultLabel}
    </span>
  )
}
