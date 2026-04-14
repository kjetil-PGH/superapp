import { useState } from 'react'

const LOGO_DEV_KEY = 'pk_KQA86TmHTO20jh-yRmX83A'

const domainMap: Record<string, string> = {
  'Netflix': 'netflix.com',
  'Spotify': 'spotify.com',
  'Apple': 'apple.com',
  'YouTube Premium': 'youtube.com',
  'Google One': 'google.com',
  'HBO Max': 'hbomax.com',
  'Disney+': 'disneyplus.com',
  'Viaplay': 'viaplay.com',
  'Adobe': 'adobe.com',
  'ChatGPT': 'openai.com',
  'Telia': 'telia.no',
  'Telenor': 'telenor.no',
  'Evo Fitness': 'evofitness.no',
  'SATS': 'sats.no',
  'Storytel': 'storytel.com',
  'Wolt': 'wolt.com',
  'Foodora': 'foodora.no',
  'Microsoft 365': 'microsoft.com',
  'Dropbox': 'dropbox.com',
  'Amazon Prime': 'amazon.com',
  'Kredinor As': 'kredinor.no',
  'Kredinor': 'kredinor.no',
  'DNB': 'dnb.no',
  'Sbanken': 'sbanken.no',
  'Vipps': 'vipps.no',
  'Finn': 'finn.no',
  'Rema 1000': 'rema.no',
  'Kiwi': 'kiwi.no',
  'Coop': 'coop.no',
  'Norgesgruppen': 'norgesgruppen.no',
}

function guessDomain(name: string, strict = false): string | null {
  const exact = domainMap[name]
  if (exact) return exact

  const lower = name.toLowerCase().trim()
  for (const [key, domain] of Object.entries(domainMap)) {
    if (lower === key.toLowerCase()) return domain
    if (lower.includes(key.toLowerCase())) return domain
  }

  if (strict) return null

  const slug = lower.replace(/\s+(as|ab|asa|ltd|inc|gmbh|co|corp)\.?$/i, '').trim()
  if (slug.includes('.')) return slug

  const clean = slug.replace(/[^a-z0-9]/g, '')
  if (clean.length >= 3) return `${clean}.com`

  return null
}

interface MerchantLogoProps {
  name: string
  size?: number
  className?: string
}

export function MerchantLogo({ name, size = 40, className = '' }: MerchantLogoProps) {
  const [failed, setFailed] = useState(false)
  const domain = guessDomain(name)

  if (!domain || failed) {
    return (
      <Fallback name={name} size={size} className={className} />
    )
  }

  const src = `https://img.logo.dev/${domain}?token=${LOGO_DEV_KEY}&size=${size * 2}&format=png`

  return (
    <img
      src={src}
      alt={name}
      width={size}
      height={size}
      className={`rounded-xl object-contain bg-white ${className}`}
      style={{ width: size, height: size }}
      onError={() => setFailed(true)}
      loading="lazy"
    />
  )
}

function Fallback({ name, size, className }: { name: string; size: number; className: string }) {
  const initials = name
    .split(/\s+/)
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div
      className={`rounded-xl bg-surface-3 flex items-center justify-center text-xs font-bold text-ink-3 shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {initials}
    </div>
  )
}

interface TransactionLogoProps {
  name: string
  isDebit: boolean
  size?: number
  className?: string
}

export function TransactionLogo({ name, isDebit, size = 36, className = '' }: TransactionLogoProps) {
  const [failed, setFailed] = useState(false)
  const domain = guessDomain(name, true)
  const bg = isDebit ? 'bg-red-50' : 'bg-emerald-50'
  const iconColor = isDebit ? 'text-red-400' : 'text-emerald-500'
  const arrow = isDebit ? '↑' : '↓'

  if (!domain || failed) {
    return (
      <div
        className={`rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${bg} ${iconColor} ${className}`}
        style={{ width: size, height: size }}
      >
        {arrow}
      </div>
    )
  }

  const src = `https://img.logo.dev/${domain}?token=${LOGO_DEV_KEY}&size=${size * 2}&format=png`

  return (
    <img
      src={src}
      alt={name}
      width={size}
      height={size}
      className={`rounded-xl object-cover shrink-0 ${className}`}
      style={{ width: size, height: size }}
      onError={() => setFailed(true)}
      loading="lazy"
    />
  )
}
