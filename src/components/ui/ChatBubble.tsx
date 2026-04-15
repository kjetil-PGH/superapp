import type { ReactNode } from 'react'

interface ChatBubbleProps {
  role: 'assistant' | 'user'
  children: ReactNode
}

export function ChatBubble({ role, children }: ChatBubbleProps) {
  const isUser = role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'bg-accent text-white rounded-[18px] rounded-br-[4px]'
            : 'bg-surface-2 text-ink rounded-[18px] rounded-bl-[4px]'
        }`}
      >
        {children}
      </div>
    </div>
  )
}
