interface SectionHeaderProps {
  title: string
  action?: string
  onAction?: () => void
}

export function SectionHeader({ title, action, onAction }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between px-[22px] py-3">
      <span className="text-sm font-bold text-ink-3 uppercase tracking-wider">{title}</span>
      {action && (
        <button onClick={onAction} className="text-sm text-accent font-semibold">
          {action}
        </button>
      )}
    </div>
  )
}
