'use client'

import { Category, Currency } from '@prisma/client'
import {
  generateRecurringSpending,
  migrateLegacyRecurringSpendings,
  removeRecurringSpending,
  saveRecurringSpending
} from '@/app/(overview)/groups/[groupId]/spendings/recurring-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useGetRecurringSpendings } from '@/data/recurring-spendings'
import { useGetAvailableCurrencies, useGetCategories } from '@/data/settings'
import {
  clearLegacyRecurringSpendings,
  frequencyLabel,
  getLegacyRecurringSpendings,
  RecurringFrequency,
  RecurringSpending
} from '@/lib/recurring-spendings'
import { formatMoney } from '@/lib/money'
import { displayToast } from '@/utils/toast-display'
import { CalendarClock, Play, Plus, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useSWRConfig } from 'swr'

export function RecurringSpendingsPanel ({ groupId }: { groupId: string }) {
  const { mutate } = useSWRConfig()
  const { data: items = [], isLoading, mutate: refreshItems } = useGetRecurringSpendings({ groupId })
  const { data: categories } = useGetCategories()
  const { data: currencies } = useGetAvailableCurrencies()
  const [isAdding, setIsAdding] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null)
  const migratedRef = useRef(false)
  const [draft, setDraft] = useState({
    label: '',
    name: '',
    amount: '',
    categoryId: '',
    currencyId: '',
    frequency: 'monthly' as RecurringFrequency
  })

  useEffect(() => {
    if (migratedRef.current || isLoading || items.length > 0) return

    const legacy = getLegacyRecurringSpendings(groupId)
    if (legacy.length === 0) return

    migratedRef.current = true

    migrateLegacyRecurringSpendings({
      groupId,
      items: legacy.map((item) => ({
        label: item.label,
        name: item.name,
        amount: item.amount,
        categoryId: item.categoryId,
        currencyId: item.currencyId,
        description: item.description ?? undefined,
        frequency: item.frequency
      }))
    })
      .then(() => {
        clearLegacyRecurringSpendings(groupId)
        refreshItems()
        displayToast('Recurrentes sincronizados a tu cuenta', 'success')
      })
      .catch(() => {
        migratedRef.current = false
      })
  }, [groupId, isLoading, items.length, refreshItems])

  useEffect(() => {
    if (!categories?.length || draft.categoryId) return
    const fallback = categories.find((c: Category) => c.name === 'Otros') ?? categories[0]
    if (fallback) setDraft((prev) => ({ ...prev, categoryId: fallback.id }))
  }, [categories, draft.categoryId])

  useEffect(() => {
    if (!currencies?.length || draft.currencyId) return
    const stored = typeof window !== 'undefined' ? localStorage.getItem('currency') : null
    const match = currencies.find((c: Currency) => c.name === stored) ?? currencies[0]
    if (match) setDraft((prev) => ({ ...prev, currencyId: match.id }))
  }, [currencies, draft.currencyId])

  const refreshSpendings = () => {
    mutate(['last-spendings', groupId])
    mutate(['debts', groupId])
    mutate(['group-settlement', groupId])
    mutate(['group-settlement-history', groupId])
    mutate(['group-activity', groupId])
    mutate(['spendings-table', groupId])
  }

  const handleSave = async () => {
    const amount = Number(draft.amount)
    if (!draft.label.trim() || !draft.name.trim() || !draft.categoryId || !draft.currencyId || amount <= 0) {
      displayToast('Completá nombre, monto, categoría y moneda.', 'error')
      return
    }

    try {
      await saveRecurringSpending({
        groupId,
        label: draft.label.trim(),
        name: draft.name.trim(),
        amount,
        categoryId: draft.categoryId,
        currencyId: draft.currencyId,
        frequency: draft.frequency
      })
      await refreshItems()
      setIsAdding(false)
      setDraft({
        label: '',
        name: '',
        amount: '',
        categoryId: draft.categoryId,
        currencyId: draft.currencyId,
        frequency: 'monthly'
      })
      displayToast('Gasto recurrente guardado', 'success')
    } catch {
      displayToast('No se pudo guardar', 'error')
    }
  }

  const handleGenerate = async (item: RecurringSpending) => {
    setIsSubmitting(item.id)
    try {
      await generateRecurringSpending({
        groupId,
        recurringId: item.id,
        name: item.name,
        amount: item.amount,
        categoryId: item.categoryId,
        currencyId: item.currencyId,
        description: item.description ?? undefined
      })
      await refreshItems()
      refreshSpendings()
      displayToast(`"${item.name}" cargado`, 'success')
    } catch (error) {
      displayToast(error instanceof Error ? error.message : 'No se pudo generar el gasto', 'error')
    } finally {
      setIsSubmitting(null)
    }
  }

  const handleDelete = async (itemId: string) => {
    try {
      await removeRecurringSpending({ groupId, itemId })
      await refreshItems()
      displayToast('Recurrente eliminado', 'success')
    } catch {
      displayToast('No se pudo eliminar', 'error')
    }
  }

  return (
    <section className="surface-panel grid gap-4 p-4 sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="grid gap-1">
          <div className="flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
            <h2 className="section-label">Recurrentes</h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Guardá gastos fijos y generalos con un click. Sincronizados en tu cuenta.
          </p>
        </div>
        {!isAdding && (
          <Button type="button" variant="outline" size="sm" onClick={() => setIsAdding(true)}>
            <Plus className="mr-1.5 h-4 w-4" />
            Agregar
          </Button>
        )}
      </div>

      {isAdding && (
        <div className="grid gap-3 rounded-lg border border-border bg-muted/20 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="recurring-label">Etiqueta</Label>
              <Input
                id="recurring-label"
                placeholder="Ej: Alquiler"
                value={draft.label}
                onChange={(e) => setDraft((prev) => ({ ...prev, label: e.target.value, name: prev.name || e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="recurring-name">Nombre del gasto</Label>
              <Input
                id="recurring-name"
                placeholder="Ej: Alquiler marzo"
                value={draft.name}
                onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="recurring-amount">Monto</Label>
              <Input
                id="recurring-amount"
                type="number"
                min={1}
                placeholder="0"
                value={draft.amount}
                onChange={(e) => setDraft((prev) => ({ ...prev, amount: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label>Frecuencia</Label>
              <Select
                value={draft.frequency}
                onValueChange={(value: RecurringFrequency) => setDraft((prev) => ({ ...prev, frequency: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Semanal</SelectItem>
                  <SelectItem value="monthly">Mensual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Categoría</Label>
              <Select
                value={draft.categoryId}
                onValueChange={(value) => setDraft((prev) => ({ ...prev, categoryId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Elegir" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((category: Category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {currencies && currencies.length > 1 && (
              <div className="grid gap-2">
                <Label>Moneda</Label>
                <Select
                  value={draft.currencyId}
                  onValueChange={(value) => setDraft((prev) => ({ ...prev, currencyId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Elegir" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency: Currency) => (
                      <SelectItem key={currency.id} value={currency.id}>
                        {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button type="button" size="sm" onClick={handleSave}>Guardar</Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => setIsAdding(false)}>Cancelar</Button>
          </div>
        </div>
      )}

      {!isLoading && items.length === 0 && !isAdding && (
        <p className="text-sm text-muted-foreground">
          Ideal para alquiler, servicios o suscripciones del grupo.
        </p>
      )}

      {items.length > 0 && (
        <ul className="divide-y divide-border rounded-lg border border-border">
          {items.map((item: RecurringSpending) => (
            <li key={item.id} className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1 grid gap-0.5">
                <p className="truncate text-sm font-medium">{item.label}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {item.name} · {formatMoney(item.amount)} · {frequencyLabel(item.frequency)}
                  {item.lastGeneratedAt && ' · generado recientemente'}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => handleGenerate(item)}
                  disabled={isSubmitting === item.id}
                >
                  <Play className="mr-1.5 h-3.5 w-3.5" />
                  {isSubmitting === item.id ? 'Generando…' : 'Generar ahora'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleDelete(item.id)}
                  aria-label={`Eliminar ${item.label}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
