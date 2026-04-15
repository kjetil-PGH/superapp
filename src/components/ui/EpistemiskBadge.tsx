interface EpistemiskBadgeProps {
  variant: 'effect-high' | 'effect-medium' | 'effort-low' | 'effort-medium' | 'data-confirmed' | 'data-document' | 'data-assumed'
  label?: string
}

const config: Record<EpistemiskBadgeProps['variant'], { bg: string; text: string; dot: string; defaultLabel: string }> = {
  'effect-high':    { bg: 'bg-ok-bg',      text: 'text-ok',    dot: 'bg-ok',    defaultLabel: 'Høy effekt' },
  'effect-medium':  { bg: 'bg-warn-bg',    text: 'text-warn',  dot: 'bg-warn',  defaultLabel: 'Middels effekt' },
  'effort-low':     { bg: 'bg-ok-bg',      text: 'text-ok',    dot: 'bg-ok',    defaultLabel: 'Lav innsats' },
  'effort-medium':  { bg: 'bg-warn-bg',    text: 'text-warn',  dot: 'bg-warn',  defaultLabel: 'Noe innsats' },
  'data-confirmed': { bg: 'bg-accent-light', text: 'text-accent', dot: 'bg-accent', defaultLabel: 'Bekreftet data' },
  'data-document':  { bg: 'bg-accent-light', text: 'text-accent', dot: 'bg-accent', defaultLabel: 'Bekreftet via dokument' },
  'data-assumed':   { bg: 'bg-surface-3',  text: 'text-ink-3', dot: 'bg-ink-3', defaultLabel: 'Antatt basert på mønster' },
}

export function EpistemiskBadge({ variant, label }: EpistemiskBadgeProps) {
  const { bg, text, dot, defaultLabel } = config[variant]

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold ${bg} ${text}`}>
      <span className={`shrink-0 rounded-full ${dot}`} style={{ width: 5, height: 5 }} />
      {label ?? defaultLabel}
    </span>
  )
}
