import { useState, useRef, useEffect } from 'react'
import { TopNav } from '@/components/layout/TopNav'
import { ChatBubble } from '@/components/ui/ChatBubble'
import { suggestedQuestions, agentResponses } from '@/data/agent-responses'

interface Message {
  role: 'user' | 'assistant'
  text: string
  source?: string
}

const INITIAL_MESSAGE: Message = {
  role: 'assistant',
  text: 'Hei! Jeg er din økonomiske rådgiver. Spør meg om hva som helst – jeg svarer basert på dine faktiske data.',
}

const FALLBACK_RESPONSE =
  'Beklager, det har jeg ikke data på ennå. Prøv et av forslagene mine!'

export function AskPage() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const hasUserMessages = messages.some((m) => m.role === 'user')

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const addResponse = (question: string) => {
    const match = agentResponses[question]
    const response: Message = match
      ? { role: 'assistant', text: match.text, source: match.source }
      : { role: 'assistant', text: FALLBACK_RESPONSE }

    setTimeout(() => {
      setMessages((prev) => [...prev, response])
    }, 500)
  }

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    setMessages((prev) => [...prev, { role: 'user', text: trimmed }])
    setInput('')
    addResponse(trimmed)
  }

  const handleSuggestion = (question: string) => {
    setMessages((prev) => [...prev, { role: 'user', text: question }])
    addResponse(question)
  }

  return (
    <div className="flex flex-col h-full">
      <TopNav title="Spør" />

      <div ref={scrollRef} className="flex-1 overflow-y-auto flex flex-col px-4 py-4 gap-3">
        {messages.map((msg, i) => (
          <ChatBubble key={i} role={msg.role}>
            <span className="whitespace-pre-wrap">{msg.text}</span>
            {msg.source && (
              <p className="mt-2 text-xs italic text-ink-3">Kilde: {msg.source}</p>
            )}
          </ChatBubble>
        ))}

        {!hasUserMessages && (
          <div className="flex flex-wrap gap-2 mt-3">
            {suggestedQuestions.map((q) => (
              <button
                key={q}
                onClick={() => handleSuggestion(q)}
                className="rounded-full bg-accent-light text-accent font-semibold text-sm px-4 py-2"
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="bg-surface border-t border-border px-4 py-3 flex gap-2 items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Skriv et spørsmål..."
          className="flex-1 rounded-full bg-surface border border-border px-4 py-3 text-sm outline-none"
        />
        <button
          onClick={handleSend}
          className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center shrink-0"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2 11 13" />
            <path d="M22 2 15 22 11 13 2 9z" />
          </svg>
        </button>
      </div>
    </div>
  )
}
