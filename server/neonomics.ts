import crypto from 'node:crypto'

const BASE_URL = process.env.NEONOMICS_BASE_URL || 'https://sandbox.neonomics.io'
const AUTH_URL = process.env.NEONOMICS_AUTH_URL || 'https://sandbox.neonomics.io/auth/realms/sandbox/protocol/openid-connect/token'
const CLIENT_ID = process.env.NEONOMICS_CLIENT_ID || ''
const CLIENT_SECRET = process.env.NEONOMICS_CLIENT_SECRET || ''
const REDIRECT_URL = process.env.NEONOMICS_REDIRECT_URL || 'http://localhost:5173/connect/callback'
const ENCRYPTION_KEY = process.env.NEONOMICS_ENCRYPTION_KEY || ''

interface TokenResponse {
  access_token: string
  expires_in: number
  refresh_token: string
  refresh_expires_in: number
  token_type: string
}

interface ConsentError {
  errorCode: string
  message: string
  type: string
  links: Array<{ type: string; rel: string; href: string; meta?: { id: string } }>
}

let cachedToken: { token: string; expiresAt: number; refreshToken: string } | null = null

export async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt - 30_000) {
    return cachedToken.token
  }

  const params = new URLSearchParams()

  if (cachedToken?.refreshToken && Date.now() < cachedToken.expiresAt + 7200_000) {
    params.set('grant_type', 'refresh_token')
    params.set('refresh_token', cachedToken.refreshToken)
  } else {
    params.set('grant_type', 'client_credentials')
  }
  params.set('client_id', CLIENT_ID)
  params.set('client_secret', CLIENT_SECRET)

  const res = await fetch(AUTH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Neonomics auth failed (${res.status}): ${text}`)
  }

  const data: TokenResponse = await res.json()
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
    refreshToken: data.refresh_token,
  }
  return data.access_token
}

export function isConfigured(): boolean {
  return Boolean(CLIENT_ID && CLIENT_SECRET)
}

export function hasEncryptionKey(): boolean {
  return Boolean(ENCRYPTION_KEY)
}

/**
 * Encrypts a PSU ID (fødselsnummer) using AES-128-GCM with the Neonomics encryption key.
 * Returns base64(iv + ciphertext + authTag) as required by the Neonomics API.
 */
function encryptPsuId(psuId: string): string {
  if (!ENCRYPTION_KEY) {
    throw new Error('NEONOMICS_ENCRYPTION_KEY is not configured. Generate one in the Neonomics Developer Portal.')
  }

  const key = Buffer.from(ENCRYPTION_KEY, 'base64')
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv('aes-128-gcm', key, iv, { authTagLength: 16 })

  const encrypted = Buffer.concat([cipher.update(psuId, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()

  return Buffer.concat([iv, encrypted, authTag]).toString('base64')
}

async function apiRequest(
  method: string,
  path: string,
  opts: { sessionId?: string; deviceId?: string; psuIp?: string; body?: unknown; query?: Record<string, string> } = {},
) {
  const token = await getAccessToken()
  const url = new URL(`${BASE_URL}${path}`)
  if (opts.query) {
    for (const [k, v] of Object.entries(opts.query)) {
      url.searchParams.set(k, v)
    }
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
    'x-device-id': opts.deviceId || 'superapp-device-001',
  }
  if (opts.sessionId) headers['x-session-id'] = opts.sessionId
  if (opts.psuIp) headers['x-psu-ip-address'] = opts.psuIp
  if (opts.body) headers['Content-Type'] = 'application/json'

  const res = await fetch(url.toString(), {
    method,
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  })

  const text = await res.text()
  let json: unknown
  try { json = JSON.parse(text) } catch { json = text }

  if (!res.ok) {
    const err = json as ConsentError
    console.log(`[api] ${method} ${path} -> ${res.status}`, JSON.stringify(json).slice(0, 500))
    if (err?.errorCode === '1426') {
      return { needsConsent: true, consentData: err }
    }
    throw new Error(`Neonomics API error (${res.status}): ${text}`)
  }

  if (path.includes('/transactions')) {
    console.log(`[api] ${method} ${path} -> ${res.status} RAW:`, text.slice(0, 800))
  } else {
    console.log(`[api] ${method} ${path} -> ${res.status} OK`)
  }
  return json
}

export async function getBanks(deviceId?: string) {
  return apiRequest('GET', '/ics/v3/banks', { deviceId })
}

export async function createSession(bankId: string, deviceId?: string) {
  return apiRequest('POST', '/ics/v3/session', { deviceId, body: { bankId } })
}

export async function getAccounts(sessionId: string, deviceId?: string, psuIp?: string) {
  return apiRequest('GET', '/ics/v3/accounts', { sessionId, deviceId, psuIp })
}

export async function getTransactions(
  accountId: string,
  sessionId: string,
  opts: { fromDate?: string; toDate?: string; deviceId?: string; psuIp?: string } = {},
) {
  const query: Record<string, string> = {}
  if (opts.fromDate) query.fromDate = opts.fromDate
  if (opts.toDate) query.toDate = opts.toDate

  return apiRequest('GET', `/ics/v3/accounts/${accountId}/transactions`, {
    sessionId,
    deviceId: opts.deviceId,
    psuIp: opts.psuIp,
    query,
  })
}

export async function handleConsent(consentUrl: string, deviceId?: string, psuIp?: string, psuId?: string) {
  const token = await getAccessToken()
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
    'x-device-id': deviceId || 'superapp-device-001',
    'x-psu-ip-address': psuIp || '109.74.179.3',
  }
  if (psuId) {
    headers['x-psu-id'] = encryptPsuId(psuId)
  }
  if (REDIRECT_URL) headers['x-redirect-url'] = REDIRECT_URL

  console.log('[consent] GET', consentUrl)

  const res = await fetch(consentUrl, { method: 'GET', headers })
  const text = await res.text()
  console.log('[consent] status:', res.status)
  console.log('[consent] response:', text.slice(0, 500))

  if (!res.ok) {
    throw new Error(`Consent request failed (${res.status}): ${text}`)
  }

  try { return JSON.parse(text) } catch { return { raw: text } }
}
