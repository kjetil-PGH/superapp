export interface NeonomicsBalance {
  amount: string
  currency: string
  /** ISO balance type: CLSG (closing), AVLB (available), EXPN (expected) */
  type: string
}

export interface NeonomicsAccount {
  id: string
  iban: string
  bban: string
  accountName: string
  accountType: string
  ownerName: string
  displayName: string
  balances: NeonomicsBalance[]
}

export interface NeonomicsTransactionAmount {
  currency: string
  value: string
}

export interface NeonomicsTransaction {
  id: string
  transactionReference: string
  transactionAmount: NeonomicsTransactionAmount
  creditDebitIndicator: 'CRDT' | 'DBIT'
  bookingDate: string
  valueDate: string
  counterpartyAccount?: string
  counterpartyName?: string
  counterpartyAgent?: string
}
