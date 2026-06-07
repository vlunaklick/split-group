import { DistributionModeType } from '@/app/(overview)/groups/[groupId]/spendings/types'

export type SpendingTemplate = {
  id: string
  label: string
  name: string
  categoryId: string
  currencyId: string
  amount?: number
  description?: string
  payAllMyself: boolean
  mode: DistributionModeType
}

const MAX_TEMPLATES = 8

function storageKey (groupId: string) {
  return `split-group:templates:${groupId}`
}

export function getSpendingTemplates (groupId: string): SpendingTemplate[] {
  if (typeof window === 'undefined') return []

  try {
    const raw = localStorage.getItem(storageKey(groupId))
    if (!raw) return []
    const parsed = JSON.parse(raw) as SpendingTemplate[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveSpendingTemplate (groupId: string, template: Omit<SpendingTemplate, 'id'>) {
  const templates = getSpendingTemplates(groupId)
  const next: SpendingTemplate = {
    ...template,
    id: crypto.randomUUID()
  }

  const updated = [next, ...templates.filter((t) => t.label !== template.label)].slice(0, MAX_TEMPLATES)
  localStorage.setItem(storageKey(groupId), JSON.stringify(updated))
  return updated
}

export function deleteSpendingTemplate (groupId: string, templateId: string) {
  const updated = getSpendingTemplates(groupId).filter((t) => t.id !== templateId)
  localStorage.setItem(storageKey(groupId), JSON.stringify(updated))
  return updated
}
