import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      className={`bg-surface rounded-[20px] shadow-sm shadow-black/[0.04] overflow-hidden ${onClick ? 'cursor-pointer active:scale-[0.99] transition-transform' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

interface CardRowProps {
  children: ReactNode
  onClick?: () => void
  className?: string
}

export function CardRow({ children, onClick, className = '' }: CardRowProps) {
  return (
    <div
      className={`flex justify-between items-center px-[18px] py-[14px] border-b border-border last:border-b-0 ${onClick ? 'cursor-pointer active:bg-surface-2' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
