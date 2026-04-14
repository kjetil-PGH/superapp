import type { NeonomicsTransaction } from '@/types/neonomics'

function tx(
  id: string,
  ref: string,
  value: string,
  date: string,
  type: 'CRDT' | 'DBIT' = 'DBIT',
  counterparty?: string,
): NeonomicsTransaction {
  return {
    id,
    transactionReference: ref,
    transactionAmount: { currency: 'NOK', value },
    creditDebitIndicator: type,
    bookingDate: `${date}T00:00:00.000Z`,
    valueDate: `${date}T00:00:00.000Z`,
    counterpartyName: counterparty ?? ref,
  }
}

export const mockTransactions: NeonomicsTransaction[] = [
  // --- Salary ---
  tx('t-sal-01', 'Lønn mars', '52000.00', '2026-03-25', 'CRDT', 'Arbeidsgiver AS'),
  tx('t-sal-02', 'Lønn feb', '52000.00', '2026-02-25', 'CRDT', 'Arbeidsgiver AS'),
  tx('t-sal-03', 'Lønn jan', '52000.00', '2026-01-25', 'CRDT', 'Arbeidsgiver AS'),
  tx('t-sal-04', 'Lønn des', '52000.00', '2025-12-25', 'CRDT', 'Arbeidsgiver AS'),
  tx('t-sal-05', 'Lønn nov', '52000.00', '2025-11-25', 'CRDT', 'Arbeidsgiver AS'),
  tx('t-sal-06', 'Lønn okt', '52000.00', '2025-10-25', 'CRDT', 'Arbeidsgiver AS'),

  // --- Netflix ---
  tx('t-nf-01', 'NETFLIX.COM', '219.00', '2026-03-15', 'DBIT', 'NETFLIX.COM'),
  tx('t-nf-02', 'NETFLIX.COM', '219.00', '2026-02-15', 'DBIT', 'NETFLIX.COM'),
  tx('t-nf-03', 'NETFLIX.COM', '219.00', '2026-01-15', 'DBIT', 'NETFLIX.COM'),
  tx('t-nf-04', 'NETFLIX.COM', '219.00', '2025-12-15', 'DBIT', 'NETFLIX.COM'),
  tx('t-nf-05', 'NETFLIX.COM', '179.00', '2025-11-15', 'DBIT', 'NETFLIX.COM'),
  tx('t-nf-06', 'NETFLIX.COM', '179.00', '2025-10-15', 'DBIT', 'NETFLIX.COM'),

  // --- Spotify ---
  tx('t-sp-01', 'SPOTIFY AB', '119.00', '2026-03-08', 'DBIT', 'SPOTIFY AB'),
  tx('t-sp-02', 'SPOTIFY AB', '119.00', '2026-02-08', 'DBIT', 'SPOTIFY AB'),
  tx('t-sp-03', 'SPOTIFY AB', '119.00', '2026-01-08', 'DBIT', 'SPOTIFY AB'),
  tx('t-sp-04', 'SPOTIFY AB', '119.00', '2025-12-08', 'DBIT', 'SPOTIFY AB'),
  tx('t-sp-05', 'SPOTIFY AB', '119.00', '2025-11-08', 'DBIT', 'SPOTIFY AB'),
  tx('t-sp-06', 'SPOTIFY AB', '119.00', '2025-10-08', 'DBIT', 'SPOTIFY AB'),

  // --- Apple iCloud ---
  tx('t-ap-01', 'APPLE.COM/BILL', '29.00', '2026-03-03', 'DBIT', 'APPLE.COM/BILL'),
  tx('t-ap-02', 'APPLE.COM/BILL', '29.00', '2026-02-03', 'DBIT', 'APPLE.COM/BILL'),
  tx('t-ap-03', 'APPLE.COM/BILL', '29.00', '2026-01-03', 'DBIT', 'APPLE.COM/BILL'),
  tx('t-ap-04', 'APPLE.COM/BILL', '29.00', '2025-12-03', 'DBIT', 'APPLE.COM/BILL'),
  tx('t-ap-05', 'APPLE.COM/BILL', '29.00', '2025-11-03', 'DBIT', 'APPLE.COM/BILL'),
  tx('t-ap-06', 'APPLE.COM/BILL', '29.00', '2025-10-03', 'DBIT', 'APPLE.COM/BILL'),

  // --- YouTube Premium ---
  tx('t-yt-01', 'GOOGLE *YOUTUBE', '129.00', '2026-03-20', 'DBIT', 'GOOGLE *YOUTUBE'),
  tx('t-yt-02', 'GOOGLE *YOUTUBE', '129.00', '2026-02-20', 'DBIT', 'GOOGLE *YOUTUBE'),
  tx('t-yt-03', 'GOOGLE *YOUTUBE', '129.00', '2026-01-20', 'DBIT', 'GOOGLE *YOUTUBE'),
  tx('t-yt-04', 'GOOGLE *YOUTUBE', '129.00', '2025-12-20', 'DBIT', 'GOOGLE *YOUTUBE'),
  tx('t-yt-05', 'GOOGLE *YOUTUBE', '99.00', '2025-11-20', 'DBIT', 'GOOGLE *YOUTUBE'),
  tx('t-yt-06', 'GOOGLE *YOUTUBE', '99.00', '2025-10-20', 'DBIT', 'GOOGLE *YOUTUBE'),

  // --- Telia ---
  tx('t-te-01', 'TELIA NORGE AS', '449.00', '2026-03-01', 'DBIT', 'TELIA NORGE AS'),
  tx('t-te-02', 'TELIA NORGE AS', '449.00', '2026-02-01', 'DBIT', 'TELIA NORGE AS'),
  tx('t-te-03', 'TELIA NORGE AS', '449.00', '2026-01-01', 'DBIT', 'TELIA NORGE AS'),
  tx('t-te-04', 'TELIA NORGE AS', '449.00', '2025-12-01', 'DBIT', 'TELIA NORGE AS'),
  tx('t-te-05', 'TELIA NORGE AS', '449.00', '2025-11-01', 'DBIT', 'TELIA NORGE AS'),
  tx('t-te-06', 'TELIA NORGE AS', '449.00', '2025-10-01', 'DBIT', 'TELIA NORGE AS'),

  // --- Adobe ---
  tx('t-ad-01', 'ADOBE SYSTEMS', '609.00', '2026-03-12', 'DBIT', 'ADOBE SYSTEMS'),
  tx('t-ad-02', 'ADOBE SYSTEMS', '609.00', '2026-02-12', 'DBIT', 'ADOBE SYSTEMS'),
  tx('t-ad-03', 'ADOBE SYSTEMS', '609.00', '2026-01-12', 'DBIT', 'ADOBE SYSTEMS'),
  tx('t-ad-04', 'ADOBE SYSTEMS', '609.00', '2025-12-12', 'DBIT', 'ADOBE SYSTEMS'),
  tx('t-ad-05', 'ADOBE SYSTEMS', '609.00', '2025-11-12', 'DBIT', 'ADOBE SYSTEMS'),

  // --- ChatGPT ---
  tx('t-cg-01', 'CHATGPT SUBSCRIPTION', '219.00', '2026-03-05', 'DBIT', 'OPENAI'),
  tx('t-cg-02', 'CHATGPT SUBSCRIPTION', '219.00', '2026-02-05', 'DBIT', 'OPENAI'),
  tx('t-cg-03', 'CHATGPT SUBSCRIPTION', '219.00', '2026-01-05', 'DBIT', 'OPENAI'),
  tx('t-cg-04', 'CHATGPT SUBSCRIPTION', '199.00', '2025-12-05', 'DBIT', 'OPENAI'),
  tx('t-cg-05', 'CHATGPT SUBSCRIPTION', '199.00', '2025-11-05', 'DBIT', 'OPENAI'),

  // --- Evo Fitness ---
  tx('t-ev-01', 'EVO TRENINGSSENTER', '449.00', '2026-03-01', 'DBIT', 'EVO TRENINGSSENTER'),
  tx('t-ev-02', 'EVO TRENINGSSENTER', '449.00', '2026-02-01', 'DBIT', 'EVO TRENINGSSENTER'),
  tx('t-ev-03', 'EVO TRENINGSSENTER', '449.00', '2026-01-01', 'DBIT', 'EVO TRENINGSSENTER'),
  tx('t-ev-04', 'EVO TRENINGSSENTER', '449.00', '2025-12-01', 'DBIT', 'EVO TRENINGSSENTER'),
  tx('t-ev-05', 'EVO TRENINGSSENTER', '449.00', '2025-11-01', 'DBIT', 'EVO TRENINGSSENTER'),

  // --- Storytel ---
  tx('t-st-01', 'STORYTEL', '169.00', '2026-03-10', 'DBIT', 'STORYTEL'),
  tx('t-st-02', 'STORYTEL', '169.00', '2026-02-10', 'DBIT', 'STORYTEL'),
  tx('t-st-03', 'STORYTEL', '169.00', '2026-01-10', 'DBIT', 'STORYTEL'),
  tx('t-st-04', 'STORYTEL', '169.00', '2025-12-10', 'DBIT', 'STORYTEL'),

  // --- Viaplay ---
  tx('t-vp-01', 'VIAPLAY', '149.00', '2026-03-18', 'DBIT', 'VIAPLAY AB'),
  tx('t-vp-02', 'VIAPLAY', '149.00', '2026-02-18', 'DBIT', 'VIAPLAY AB'),
  tx('t-vp-03', 'VIAPLAY', '149.00', '2026-01-18', 'DBIT', 'VIAPLAY AB'),

  // --- One-off / irregular ---
  tx('t-g-01', 'REMA 1000 GRUNERLØKKA', '487.00', '2026-03-13', 'DBIT'),
  tx('t-g-02', 'KIWI TORGGATA', '312.00', '2026-03-12', 'DBIT'),
  tx('t-g-03', 'WOLT', '289.00', '2026-03-12', 'DBIT', 'WOLT'),
  tx('t-g-04', 'FOODORA', '354.00', '2026-03-10', 'DBIT', 'FOODORA'),
  tx('t-g-05', 'REMA 1000 GRUNERLØKKA', '654.00', '2026-03-10', 'DBIT'),
  tx('t-g-06', 'COOP EXTRA STORO', '234.00', '2026-03-10', 'DBIT'),
  tx('t-g-07', 'MENY BOGSTADVEIEN', '278.00', '2026-03-08', 'DBIT'),
  tx('t-g-08', 'WOLT', '271.00', '2026-03-05', 'DBIT', 'WOLT'),
  tx('t-g-09', 'FOODORA', '198.00', '2026-02-22', 'DBIT', 'FOODORA'),
  tx('t-g-10', 'WOLT', '315.00', '2026-02-15', 'DBIT', 'WOLT'),
  tx('t-g-11', 'FOODORA', '242.00', '2026-01-18', 'DBIT', 'FOODORA'),
  tx('t-g-12', 'WOLT', '189.00', '2026-01-10', 'DBIT', 'WOLT'),
]
