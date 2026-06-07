export type RecurringFrequency = 'weekly' | 'monthly'

export type RecurringSpending = {
  id: string
  label: string
  name: string
  amount: number
  categoryId: string
  currencyId: string
  description?: string | null
  frequency: RecurringFrequency
  lastGeneratedAt?: string | null
}

export function frequencyLabel (frequency: RecurringFrequency) {
  return frequency === 'weekly' ? 'Semanal' : 'Mensual'
}

export function toDbFrequency (frequency: RecurringFrequency): 'WEEKLY' | 'MONTHLY' {
  return frequency === 'weekly' ? 'WEEKLY' : 'MONTHLY'
}

export function fromDbFrequency (frequency: 'WEEKLY' | 'MONTHLY'): RecurringFrequency {
  return frequency === 'WEEKLY' ? 'weekly' : 'monthly'
}

/** One-time import from legacy localStorage (client only). */
export function getLegacyRecurringSpendings (groupId: string): RecurringSpending[] {
  if (typeof window === 'undefined') return []

  try {
    const raw = localStorage.getItem(`split-group:recurring:${groupId}`)
    if (!raw) return []
    const parsed = JSON.parse(raw) as RecurringSpending[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function clearLegacyRecurringSpendings (groupId: string) {
  if (typeof window === 'undefined') return
  localStorage.removeItem(`split-group:recurring:${groupId}`)
}
