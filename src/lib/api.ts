import type { NeonomicsAccount, NeonomicsTransaction } from '@/types/neonomics'

const API_BASE = import.meta.env.VITE_API_BASE || ''

function bankHeaders(): Record<string, string> {
  const headers: Record<string, string> = {}
  const deviceId = localStorage.getItem('neo_device_id')
  const sessionId = localStorage.getItem('neo_session_id')
  if (deviceId) headers['x-device-id'] = deviceId
  if (sessionId) headers['x-session-id'] = sessionId
  return headers
}

export interface HealthStatus {
  ok: boolean
  configured: boolean
  encryptionKey?: boolean
}

export async function checkHealth(): Promise<HealthStatus> {
  try {
    const res = await fetch(`${API_BASE}/api/health`)
    return res.json()
  } catch {
    return { ok: false, configured: false }
  }
}

export interface Bank {
  id: string
  bankDisplayName: string
  bankOfficialName: string
  countryCode: string
  bic: string
  supportedServices: string[]
  personalIdentificationRequired: boolean
  status: string
}

export async function getBanks(): Promise<Bank[]> {
  const res = await fetch(`${API_BASE}/api/banks`, { headers: bankHeaders() })
  if (!res.ok) throw new Error('Failed to fetch banks')
  return res.json()
}

export async function createSession(bankId: string): Promise<{ sessionId: string }> {
  const res = await fetch(`${API_BASE}/api/session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...bankHeaders() },
    body: JSON.stringify({ bankId }),
  })
  if (!res.ok) throw new Error('Failed to create session')
  return res.json()
}

export interface ConsentNeeded {
  needsConsent: true
  consentData: {
    errorCode: string
    links: Array<{ href: string }>
  }
}

export async function getAccounts(): Promise<NeonomicsAccount[] | ConsentNeeded> {
  const res = await fetch(`${API_BASE}/api/accounts`, { headers: bankHeaders() })
  if (!res.ok) throw new Error('Failed to fetch accounts')
  const data = await res.json()

  if (data?.needsConsent) return data as ConsentNeeded
  return data
}

export async function requestConsent(consentUrl: string, psuId?: string): Promise<{ links: Array<{ href: string }> }> {
  const res = await fetch(`${API_BASE}/api/consent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...bankHeaders() },
    body: JSON.stringify({ consentUrl, psuId }),
  })
  if (!res.ok) throw new Error('Failed to request consent')
  return res.json()
}

export function getCachedTransactions(): NeonomicsTransaction[] | null {
  const raw = localStorage.getItem('neo_transactions')
  if (!raw) return null
  try {
    const { data, timestamp } = JSON.parse(raw)
    const age = Date.now() - timestamp
    if (age > 1000 * 60 * 60) return null
    return data
  } catch { return null }
}

export function cacheTransactions(txs: NeonomicsTransaction[]) {
  localStorage.setItem('neo_transactions', JSON.stringify({ data: txs, timestamp: Date.now() }))
}

let inflightRequest: Promise<NeonomicsTransaction[]> | null = null

export async function getTransactions(accountId: string, forceRefresh = false): Promise<NeonomicsTransaction[]> {
  if (!forceRefresh) {
    const cached = getCachedTransactions()
    if (cached) return cached
  }

  if (inflightRequest) return inflightRequest

  inflightRequest = fetchTransactionsOnce(accountId)
  try {
    return await inflightRequest
  } finally {
    inflightRequest = null
  }
}

async function fetchTransactionsOnce(accountId: string): Promise<NeonomicsTransaction[]> {
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
  const fromDate = sixMonthsAgo.toISOString().split('T')[0]

  const res = await fetch(`${API_BASE}/api/accounts/${accountId}/transactions?fromDate=${fromDate}`, {
    headers: bankHeaders(),
  })
  if (!res.ok) throw new Error('Failed to fetch transactions')
  const data = await res.json()

  let txs: NeonomicsTransaction[] = []
  if (Array.isArray(data)) txs = data
  else if (data?.response?.booked) txs = [...data.response.booked, ...(data.response.pending || [])]
  else if (data?.transactions) txs = data.transactions

  if (txs.length > 0) cacheTransactions(txs)
  return txs
}

export function isFullyConnected(): boolean {
  return Boolean(localStorage.getItem('neo_session_id') && localStorage.getItem('neo_accounts'))
}

export function hasSession(): boolean {
  return Boolean(localStorage.getItem('neo_session_id'))
}

export function getStoredAccounts(): NeonomicsAccount[] | null {
  const raw = localStorage.getItem('neo_accounts')
  if (!raw) return null
  try { return JSON.parse(raw) } catch { return null }
}

export function getConnectionInfo(): { bankName: string; connectedAt: string } | null {
  const info = localStorage.getItem('neo_connection')
  return info ? JSON.parse(info) : null
}

export function saveConnection(sessionId: string, deviceId: string, bankName: string) {
  localStorage.setItem('neo_session_id', sessionId)
  localStorage.setItem('neo_device_id', deviceId)
  localStorage.setItem('neo_connection', JSON.stringify({ bankName, connectedAt: new Date().toISOString() }))
}

export function saveAccounts(accounts: NeonomicsAccount[]) {
  localStorage.setItem('neo_accounts', JSON.stringify(accounts))
}

export function clearConnection() {
  localStorage.removeItem('neo_session_id')
  localStorage.removeItem('neo_device_id')
  localStorage.removeItem('neo_connection')
  localStorage.removeItem('neo_accounts')
  localStorage.removeItem('neo_transactions')
}
