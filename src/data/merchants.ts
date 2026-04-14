import type { ExpenseCategory } from '@/types/domain'

export interface MerchantRule {
  patterns: RegExp[]
  name: string
  category: ExpenseCategory
  logo?: string
}

export const merchantRules: MerchantRule[] = [
  {
    patterns: [/NETFLIX/i, /NETFLIX\.COM/i],
    name: 'Netflix',
    category: 'streaming',
  },
  {
    patterns: [/SPOTIFY/i, /SPOTIFY AB/i],
    name: 'Spotify',
    category: 'music',
  },
  {
    patterns: [/APPLE\.COM\/BILL/i, /APPLE\.COM/i, /ITUNES/i],
    name: 'Apple',
    category: 'software',
  },
  {
    patterns: [/GOOGLE \*YOUTUBE/i, /YOUTUBE PREMIUM/i, /YOUTUBE/i],
    name: 'YouTube Premium',
    category: 'streaming',
  },
  {
    patterns: [/GOOGLE \*STORAGE/i, /GOOGLE ONE/i],
    name: 'Google One',
    category: 'cloud',
  },
  {
    patterns: [/HBO ?MAX/i, /HBO/i],
    name: 'HBO Max',
    category: 'streaming',
  },
  {
    patterns: [/DISNEY\s?\+/i, /DISNEY PLUS/i],
    name: 'Disney+',
    category: 'streaming',
  },
  {
    patterns: [/VIAPLAY/i],
    name: 'Viaplay',
    category: 'streaming',
  },
  {
    patterns: [/ADOBE/i, /ADOBE SYSTEMS/i],
    name: 'Adobe',
    category: 'software',
  },
  {
    patterns: [/CHATGPT/i, /OPENAI/i],
    name: 'ChatGPT',
    category: 'software',
  },
  {
    patterns: [/TELIA NORGE/i, /TELIA/i],
    name: 'Telia',
    category: 'telecom',
  },
  {
    patterns: [/TELENOR/i],
    name: 'Telenor',
    category: 'telecom',
  },
  {
    patterns: [/EVO\s?(TRENINGS|FITNESS)/i, /EVO\b/i],
    name: 'Evo Fitness',
    category: 'fitness',
  },
  {
    patterns: [/SATS/i],
    name: 'SATS',
    category: 'fitness',
  },
  {
    patterns: [/STORYTEL/i],
    name: 'Storytel',
    category: 'streaming',
  },
  {
    patterns: [/WOLT/i],
    name: 'Wolt',
    category: 'food_delivery',
  },
  {
    patterns: [/FOODORA/i],
    name: 'Foodora',
    category: 'food_delivery',
  },
  {
    patterns: [/MICROSOFT/i, /MSFT/i],
    name: 'Microsoft 365',
    category: 'software',
  },
  {
    patterns: [/DROPBOX/i],
    name: 'Dropbox',
    category: 'cloud',
  },
  {
    patterns: [/AMAZON PRIME/i],
    name: 'Amazon Prime',
    category: 'streaming',
  },
]
