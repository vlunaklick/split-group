'use client'

import { DistributionModeType } from '@/app/(overview)/groups/[groupId]/spendings/types'
import { Button } from '@/components/ui/button'
import {
  deleteSpendingTemplate,
  getSpendingTemplates,
  saveSpendingTemplate,
  SpendingTemplate
} from '@/lib/spending-templates'
import { displayToast } from '@/utils/toast-display'
import { BookmarkPlus, X } from 'lucide-react'
import { useEffect, useState } from 'react'

export type SpendingPrefill = {
  name: string
  amount: number
  description?: string
  categoryId: string
  currencyId: string
  date: Date
  payers?: { userId: string, amount: number }[]
  debters?: { userId: string, amount: number }[]
  mode?: DistributionModeType
  payAllMyself?: boolean
}

export function SpendingTemplatePicker ({
  groupId,
  formValues,
  onApply
}: {
  groupId: string
  formValues: {
    name: string
    amount: number
    description?: string
    categoryId: string
    currencyId: string
  }
  onApply: (prefill: SpendingPrefill) => void
}) {
  const [templates, setTemplates] = useState<SpendingTemplate[]>([])

  useEffect(() => {
    setTemplates(getSpendingTemplates(groupId))
  }, [groupId])

  const handleSave = () => {
    if (!formValues.name.trim() || !formValues.categoryId || !formValues.currencyId) {
      displayToast('Completá nombre, categoría y moneda para guardar la plantilla.', 'error')
      return
    }

    const updated = saveSpendingTemplate(groupId, {
      label: formValues.name.trim(),
      name: formValues.name.trim(),
      categoryId: formValues.categoryId,
      currencyId: formValues.currencyId,
      amount: formValues.amount > 0 ? formValues.amount : undefined,
      description: formValues.description,
      payAllMyself: true,
      mode: 'equal'
    })

    setTemplates(updated)
    displayToast('Plantilla guardada', 'success')
  }

  const handleDelete = (templateId: string) => {
    const updated = deleteSpendingTemplate(groupId, templateId)
    setTemplates(updated)
  }

  const handleApply = (template: SpendingTemplate) => {
    onApply({
      name: template.name,
      amount: template.amount ?? 0,
      description: template.description ?? '',
      categoryId: template.categoryId,
      currencyId: template.currencyId,
      date: new Date(),
      mode: template.mode,
      payAllMyself: template.payAllMyself
    })
    displayToast(`Plantilla "${template.label}" aplicada`, 'success')
  }

  return (
    <div className="grid gap-3 rounded-lg border border-border bg-muted/20 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium text-muted-foreground">Plantillas</p>
        <Button type="button" variant="ghost" size="sm" className="h-8 gap-1.5 px-2 text-xs" onClick={handleSave}>
          <BookmarkPlus className="h-3.5 w-3.5" />
          Guardar actual
        </Button>
      </div>

      {templates.length === 0
        ? (
          <p className="text-xs text-muted-foreground">
            Guardá combos frecuentes (ej. Super, Alquiler) para cargarlos en un toque.
          </p>
          )
        : (
          <div className="flex flex-wrap gap-2">
            {templates.map((template) => (
              <div key={template.id} className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => handleApply(template)}
                >
                  {template.label}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground"
                  onClick={() => handleDelete(template.id)}
                  aria-label={`Eliminar plantilla ${template.label}`}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
          )}
    </div>
  )
}

export function buildSpendingPrefillFromSpending (spending: {
  name: string
  value: number
  description?: string | null
  categoryId: string
  currencyId: string
  payments?: { payerId: string, amount: number }[]
  debts?: { debterId: string, amount: number }[]
}): SpendingPrefill {
  const payers = spending.payments?.map((p) => ({
    userId: p.payerId,
    amount: p.amount
  })) ?? []

  const debterMap = new Map<string, number>()
  spending.debts?.forEach((debt) => {
    debterMap.set(debt.debterId, (debterMap.get(debt.debterId) ?? 0) + debt.amount)
  })

  const debters = Array.from(debterMap.entries()).map(([userId, amount]) => ({
    userId,
    amount
  }))

  const firstAmount = debters[0]?.amount ?? 0
  const mode: DistributionModeType =
    debters.length === 0 || debters.every((d) => d.amount === firstAmount)
      ? 'equal'
      : 'custom'

  return {
    name: spending.name,
    amount: spending.value,
    description: spending.description ?? '',
    categoryId: spending.categoryId,
    currencyId: spending.currencyId,
    date: new Date(),
    payers,
    debters,
    mode,
    payAllMyself: payers.length === 1 && payers[0]?.amount === spending.value
  }
}
