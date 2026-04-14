import type { NeonomicsAccount } from '@/types/neonomics'

export const mockAccounts: NeonomicsAccount[] = [
  {
    id: 'acc-bruk-001',
    iban: 'NO9386011117947',
    bban: '86011117947',
    accountName: 'Brukskonto',
    accountType: 'CACC',
    ownerName: 'Ola Nordmann',
    displayName: 'Daglig bruk',
    balances: [
      { amount: '42850.00', currency: 'NOK', type: 'AVLB' },
      { amount: '42850.00', currency: 'NOK', type: 'CLSG' },
    ],
  },
  {
    id: 'acc-spare-001',
    iban: 'NO2490412263056',
    bban: '90412263056',
    accountName: 'Sparekonto',
    accountType: 'SVGS',
    ownerName: 'Ola Nordmann',
    displayName: 'Sparepenger',
    balances: [
      { amount: '185200.00', currency: 'NOK', type: 'AVLB' },
      { amount: '185200.00', currency: 'NOK', type: 'CLSG' },
    ],
  },
]
