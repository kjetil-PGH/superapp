import type { ReactNode } from 'react'

interface ExpandablePanelProps {
  children: ReactNode
  isOpen: boolean
}

export function ExpandablePanel({ children, isOpen }: ExpandablePanelProps) {
  if (!isOpen) return null

  return (
    <div className="bg-surface-2 px-5 py-4 border-t border-border">
      {children}
    </div>
  )
}
