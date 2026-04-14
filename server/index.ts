import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import * as neo from './neonomics'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, configured: neo.isConfigured(), encryptionKey: neo.hasEncryptionKey() })
})

app.get('/api/banks', async (req, res) => {
  try {
    const deviceId = req.headers['x-device-id'] as string | undefined
    const banks = await neo.getBanks(deviceId)
    res.json(banks)
  } catch (e) {
    console.error('GET /api/banks error:', e)
    res.status(502).json({ error: (e as Error).message })
  }
})

app.post('/api/session', async (req, res) => {
  try {
    const { bankId } = req.body
    if (!bankId) {
      res.status(400).json({ error: 'bankId is required' })
      return
    }
    const deviceId = req.headers['x-device-id'] as string | undefined
    const session = await neo.createSession(bankId, deviceId)
    res.json(session)
  } catch (e) {
    console.error('POST /api/session error:', e)
    res.status(502).json({ error: (e as Error).message })
  }
})

app.get('/api/accounts', async (req, res) => {
  try {
    const sessionId = req.headers['x-session-id'] as string
    const deviceId = req.headers['x-device-id'] as string | undefined
    const psuIp = req.ip || '127.0.0.1'
    if (!sessionId) {
      res.status(400).json({ error: 'x-session-id header is required' })
      return
    }
    const result = await neo.getAccounts(sessionId, deviceId, psuIp)
    res.json(result)
  } catch (e) {
    console.error('GET /api/accounts error:', e)
    res.status(502).json({ error: (e as Error).message })
  }
})

app.get('/api/accounts/:id/transactions', async (req, res) => {
  try {
    const sessionId = req.headers['x-session-id'] as string
    const deviceId = req.headers['x-device-id'] as string | undefined
    const psuIp = req.ip || '127.0.0.1'
    if (!sessionId) {
      res.status(400).json({ error: 'x-session-id header is required' })
      return
    }
    const { fromDate, toDate } = req.query as { fromDate?: string; toDate?: string }
    const result = await neo.getTransactions(req.params.id, sessionId, { fromDate, toDate, deviceId, psuIp })
    const keys = typeof result === 'object' && result !== null ? Object.keys(result as object) : []
    console.log(`[transactions] Response keys: [${keys.join(', ')}], isArray: ${Array.isArray(result)}`)
    if (!Array.isArray(result)) {
      const sample = JSON.stringify(result).slice(0, 500)
      console.log(`[transactions] Sample: ${sample}`)
    } else {
      console.log(`[transactions] ${(result as unknown[]).length} items, first: ${JSON.stringify((result as unknown[])[0]).slice(0, 300)}`)
    }
    res.json(result)
  } catch (e) {
    console.error('GET /api/accounts/:id/transactions error:', e)
    res.status(502).json({ error: (e as Error).message })
  }
})

app.post('/api/consent', async (req, res) => {
  try {
    const { consentUrl, psuId } = req.body
    if (!consentUrl) {
      res.status(400).json({ error: 'consentUrl is required' })
      return
    }
    const deviceId = req.headers['x-device-id'] as string | undefined
    const psuIp = req.ip || '127.0.0.1'
    const result = await neo.handleConsent(consentUrl, deviceId, psuIp, psuId)
    res.json(result)
  } catch (e) {
    console.error('POST /api/consent error:', e)
    res.status(502).json({ error: (e as Error).message })
  }
})

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`)
  console.log(`Neonomics configured: ${neo.isConfigured()}, encryption key: ${neo.hasEncryptionKey()}`)
})
