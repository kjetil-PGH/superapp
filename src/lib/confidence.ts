import type { Confidence } from '@/types/domain'

export function confidenceLabel(c: Confidence): string {
  switch (c) {
    case 'high': return 'Bekreftet mønster'
    case 'medium': return 'Sannsynlig'
    case 'low': return 'Antatt'
  }
}

export function confidenceColor(c: Confidence): { bg: string; text: string; dot: string } {
  switch (c) {
    case 'high':
      return { bg: 'bg-ok-bg', text: 'text-ok', dot: 'bg-ok' }
    case 'medium':
      return { bg: 'bg-warn-bg', text: 'text-warn', dot: 'bg-warn' }
    case 'low':
      return { bg: 'bg-surface-3', text: 'text-ink-3', dot: 'bg-ink-3' }
  }
}
