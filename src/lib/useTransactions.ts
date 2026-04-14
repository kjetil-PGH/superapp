import { useState, useEffect, useCallback } from 'react'
import type { NeonomicsTransaction } from '@/types/neonomics'
import { getTransactions, getCachedTransactions, isFullyConnected, getStoredAccounts, clearConnection } from '@/lib/api'
import { mockTransactions } from '@/data/mock-transactions'

function deduplicateAndMerge(live: NeonomicsTransaction[], mock: NeonomicsTransaction[]): NeonomicsTransaction[] {
  const liveIds = new Set(live.map(t => t.id))
  const liveRefs = new Set(live.map(t => `${t.transactionReference}|${t.bookingDate}|${t.transactionAmount.value}`))

  const uniqueMock = mock.filter(t => {
    if (liveIds.has(t.id)) return false
    const key = `${t.transactionReference}|${t.bookingDate}|${t.transactionAmount.value}`
    return !liveRefs.has(key)
  })

  return [...live, ...uniqueMock]
    .sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime())
}

export function useTransactions() {
  const cached = getCachedTransactions()
  const [liveTransactions, setLiveTransactions] = useState<NeonomicsTransaction[]>(cached ?? [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [connected, setConnected] = useState(isFullyConnected())

  const transactions = deduplicateAndMerge(liveTransactions, mockTransactions)

  const disconnect = useCallback(() => {
    clearConnection()
    setConnected(false)
    setLiveTransactions([])
    setError(null)
  }, [])

  const refresh = useCallback(() => {
    const accounts = getStoredAccounts()
    const accountId = accounts?.[0]?.id
    if (!accountId) return

    setLoading(true)
    setError(null)
    getTransactions(accountId, true)
      .then(txs => setLiveTransactions(txs))
      .catch(e => setError((e as Error).message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!connected) {
      setLiveTransactions([])
      return
    }

    if (cached && cached.length > 0) return

    const accounts = getStoredAccounts()
    const accountId = accounts?.[0]?.id

    if (!accountId) {
      setConnected(false)
      setLiveTransactions([])
      return
    }

    setLoading(true)
    setError(null)

    getTransactions(accountId)
      .then(txs => setLiveTransactions(txs))
      .catch(e => {
        setLiveTransactions([])
        setError((e as Error).message)
      })
      .finally(() => setLoading(false))
  }, [connected])

  return { transactions, loading, error, connected, disconnect, refresh }
}
