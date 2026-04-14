import type { ReactNode } from 'react'

interface InfoBoxProps {
  variant: 'ok' | 'warn' | 'err'
  title?: string
  children: ReactNode
  className?: string
}

export function InfoBox({ variant, title, children, className = '' }: InfoBoxProps) {
  const styles = {
    ok: { bg: 'bg-ok-bg', title: 'text-ok', text: 'text-ok' },
    warn: { bg: 'bg-warn-bg', title: 'text-warn', text: 'text-warn' },
    err: { bg: 'bg-err-bg', title: 'text-accent-dark', text: 'text-accent-dark' },
  }
  const s = styles[variant]
  return (
    <div className={`${s.bg} rounded-[20px] p-4 ${className}`}>
      {title && <div className={`text-sm font-semibold mb-1 ${s.title}`}>{title}</div>}
      <div className={`text-sm leading-relaxed ${s.text}`}>{children}</div>
    </div>
  )
}
