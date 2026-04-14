import type { ReactNode, ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  children: ReactNode
  fullWidth?: boolean
}

export function Button({ variant = 'primary', children, fullWidth = true, className = '', ...props }: ButtonProps) {
  const base = 'px-5 py-[15px] rounded-full text-base font-semibold text-center transition-all active:scale-[0.98]'
  const variants = {
    primary: 'bg-ink text-white shadow-sm',
    secondary: 'bg-surface text-ink border border-border-m',
  }
  const width = fullWidth ? 'w-full' : ''
  return (
    <button className={`${base} ${variants[variant]} ${width} ${className}`} {...props}>
      {children}
    </button>
  )
}
