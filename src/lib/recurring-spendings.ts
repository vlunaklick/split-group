export type RecurringFrequency = 'weekly' | 'monthly'

export type RecurringSpending = {
  id: string
  label: string
  name: string
  amount: number
  categoryId: string
  currencyId: string
  description?: string
  frequency: RecurringFrequency
  lastGeneratedAt?: string
}

const MAX_RECURRING = 6

function storageKey (groupId: string) {
  return `split-group:recurring:${groupId}`
}

export function getRecurringSpendings (groupId: string): RecurringSpending[] {
  if (typeof window === 'undefined') return []

  try {
    const raw = localStorage.getItem(storageKey(groupId))
    if (!raw) return []
    const parsed = JSON.parse(raw) as RecurringSpending[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveRecurringSpending (
  groupId: string,
  item: Omit<RecurringSpending, 'id' | 'lastGeneratedAt'>
) {
  const items = getRecurringSpendings(groupId)
  const next: RecurringSpending = {
    ...item,
    id: crypto.randomUUID()
  }

  const updated = [next, ...items.filter((i) => i.label !== item.label)].slice(0, MAX_RECURRING)
  localStorage.setItem(storageKey(groupId), JSON.stringify(updated))
  return updated
}

export function markRecurringGenerated (groupId: string, itemId: string) {
  const updated = getRecurringSpendings(groupId).map((item) => (
    item.id === itemId
      ? { ...item, lastGeneratedAt: new Date().toISOString() }
      : item
  ))
  localStorage.setItem(storageKey(groupId), JSON.stringify(updated))
  return updated
}

export function deleteRecurringSpending (groupId: string, itemId: string) {
  const updated = getRecurringSpendings(groupId).filter((item) => item.id !== itemId)
  localStorage.setItem(storageKey(groupId), JSON.stringify(updated))
  return updated
}

export function frequencyLabel (frequency: RecurringFrequency) {
  return frequency === 'weekly' ? 'Semanal' : 'Mensual'
}
