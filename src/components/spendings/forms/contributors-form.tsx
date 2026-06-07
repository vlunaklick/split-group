'use client'

import { DistributionMode, DistributionModeType } from '@/app/(overview)/groups/[groupId]/spendings/types'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useStepper } from '@/components/ui/stepper'
import { formatMoney } from '@/lib/money'
import { useEffect, useRef, useState } from 'react'
import { EqualDistributionForm } from './equal-distribution-form'
import { CustomDistributionForm } from './custom-distribution-form'
import { Badge } from '@/components/ui/badge'

export const DebtersForm = ({
  participants,
  isLoading,
  totalAmount,
  payers,
  finalData,
  setFinalData,
  mode,
  setMode,
  onSubmit,
  isSubmitting,
  submitLabel = 'Crear gasto',
  initialDebters
}: {
  participants?: any[]
  isLoading: boolean
  totalAmount: number
  payers: any
  finalData: any
  setFinalData: (data: any) => void
  mode: DistributionModeType
  setMode: (mode: DistributionModeType) => void
  onSubmit?: (data: any) => void
  isSubmitting?: boolean
  submitLabel?: string
  initialDebters?: { userId: string, amount: number }[]
}) => {
  const { prevStep } = useStepper()
  const [error, setError] = useState<string | null>(null)
  const [debters, setDebters] = useState<{ userId: string, amount: number }[]>(initialDebters ?? [])
  const seededDebters = useRef(Boolean(initialDebters?.length))

  const payerIds = new Set(payers?.map((p: any) => p.userId) ?? [])

  const selectAllEligible = () => {
    const eligible = participants?.filter((p: any) => !payerIds.has(p.id)) ?? []
    if (eligible.length === 0) return
    const amount = Math.round(totalAmount / eligible.length)
    setDebters(eligible.map((p: any) => ({ userId: p.id, amount })))
    setError(null)
  }

  useEffect(() => {
    if (initialDebters?.length) {
      setDebters(initialDebters)
      seededDebters.current = true
    }
  }, [initialDebters])

  useEffect(() => {
    if (seededDebters.current || initialDebters?.length) return
    if (mode === DistributionMode.EQUAL && debters.length === 0 && participants?.length) {
      selectAllEligible()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, participants, payers, totalAmount, initialDebters?.length])

  const handleSelectChange = (value: string) => {
    setDebters((prev) => {
      const exists = prev.find((debter) => debter.userId === value)
      if (exists) return prev.filter((debter) => debter.userId !== value)
      return [...prev, { userId: value, amount: 0 }]
    })
    setError(null)
  }

  useEffect(() => {
    if (mode !== DistributionMode.EQUAL || debters.length === 0) return
    const amount = Math.round(totalAmount / debters.length)
    if (debters.every((d) => d.amount === amount)) return
    setDebters((prev) => prev.map((d) => ({ ...d, amount })))
  }, [debters.length, mode, totalAmount])

  const isOptionSelected = (value: string) => !!debters.find((debter) => debter.userId === value)

  const handleSubmit = () => {
    setError(null)

    if (debters.length === 0) {
      setError('Elegí quién debe su parte')
      return
    }

    if (mode !== DistributionMode.EQUAL) {
      const totalDebtersAmount = debters.reduce((acc, debter) => acc + debter.amount, 0)
      if (totalDebtersAmount !== totalAmount) {
        setError(`Las partes deben sumar ${formatMoney(totalAmount)}`)
        return
      }
    }

    const spendingData = {
      ...finalData,
      debters: debters.map((debter) => ({ userId: debter.userId, amount: debter.amount }))
    }

    setFinalData(spendingData)

    if (onSubmit) {
      onSubmit(spendingData)
    }
  }

  const changeModeSelect = (value: string) => {
    setMode(value as DistributionModeType)
    setDebters([])
    setError(null)
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">A repartir</p>
        <Badge variant="secondary" className="font-mono">{formatMoney(totalAmount)}</Badge>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Label className="shrink-0">Modo</Label>
        <Select onValueChange={changeModeSelect} value={mode}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="equal">Partes iguales</SelectItem>
            <SelectItem value="custom">Montos distintos</SelectItem>
          </SelectContent>
        </Select>
        {mode === DistributionMode.EQUAL && (
          <Button type="button" variant="secondary" size="sm" onClick={selectAllEligible} disabled={isLoading}>
            Todos excepto quien pagó
          </Button>
        )}
      </div>

      <Separator />

      {mode === DistributionMode.EQUAL && (
        <EqualDistributionForm
          debters={debters}
          participants={participants}
          isLoading={isLoading}
          payers={payers}
          handleSelectChange={handleSelectChange}
          isOptionSelected={isOptionSelected}
          totalAmount={totalAmount}
          setDebters={setDebters}
        />
      )}

      {mode === DistributionMode.CUSTOM && (
        <CustomDistributionForm
          debters={debters}
          setDebters={setDebters}
          isLoading={isLoading}
          participants={participants}
          isOptionSelected={isOptionSelected}
          handleSelectChange={handleSelectChange}
        />
      )}

      {debters.length === 0 && (
        <p className="text-sm text-muted-foreground">Elegí quién participa en la división</p>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button
        onClick={handleSubmit}
        className="w-full"
        disabled={isSubmitting || debters.length === 0}
      >
        {isSubmitting ? 'Guardando…' : submitLabel}
      </Button>

      <Button onClick={prevStep} className="w-full" variant="ghost" disabled={isSubmitting}>
        Atrás
      </Button>
    </div>
  )
}
