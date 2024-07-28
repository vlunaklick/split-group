export interface Payer {
  userId: string
  amount: number
}

export interface Debter {
  userId: string
  amount: number
}

export interface Spending {
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
