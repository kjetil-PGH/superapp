export function formatNOK(amount: number, opts?: { decimals?: boolean }): string {
  const abs = Math.abs(amount)
  const formatted = abs.toLocaleString('nb-NO', {
    minimumFractionDigits: opts?.decimals ? 2 : 0,
    maximumFractionDigits: opts?.decimals ? 2 : 0,
  })
  const sign = amount < 0 ? '−' : ''
  return `${sign}${formatted} kr`
}

export function formatNOKShort(amount: number): string {
  const abs = Math.abs(amount)
  const sign = amount < 0 ? '−' : ''
  if (abs >= 1_000_000) {
    return `${sign}${(abs / 1_000_000).toFixed(1).replace('.0', '')} mill kr`
  }
  return `${sign}${abs.toLocaleString('nb-NO')} kr`
}

export function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function formatDateShort(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' })
}

export function categoryLabel(cat: string): string {
  const labels: Record<string, string> = {
    streaming: 'Streaming',
    music: 'Musikk',
    software: 'Programvare',
    telecom: 'Telekom',
    fitness: 'Trening',
    news: 'Nyheter',
    gaming: 'Gaming',
    cloud: 'Sky-lagring',
    food_delivery: 'Matleveranse',
    insurance: 'Forsikring',
    other: 'Annet',
  }
  return labels[cat] ?? cat
}
