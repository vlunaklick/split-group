export interface Payer {
  userId: string
  amount: number
}

export interface Debter {
  userId: string
  amount: number
}

export interface SpendingInfo {
  name: string
  userId: string
  amount: number
  description: string
  categoryId: string
  currencyId: string
  date: string
  payers: Payer[]
  debters: Debter[]
}

export const DistributionMode = {
  EQUAL: 'equal',
  CUSTOM: 'custom'
} as const

export type DistributionModeType = typeof DistributionMode[keyof typeof DistributionMode]
