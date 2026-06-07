'use client'

import { DistributionMode, DistributionModeType } from '@/app/(overview)/groups/[groupId]/spendings/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useStepper } from '@/components/ui/stepper'
import { useEffect, useState } from 'react'
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
  submitLabel
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
}) => {
  const { prevStep, nextStep } = useStepper()
  const [error, setError] = useState<string | null>(null)
  const [debters, setDebters] = useState<{
    userId: string
    amount: number
  }[]>([])

  const payerIds = new Set(payers?.map((p: any) => p.userId) ?? [])

  const selectAllEligible = () => {
    const eligible = participants?.filter((p: any) => !payerIds.has(p.id)) ?? []
    if (eligible.length === 0) return
    const amount = Math.round(totalAmount / eligible.length)
    setDebters(eligible.map((p: any) => ({ userId: p.id, amount })))
    setError(null)
  }

  useEffect(() => {
    if (mode === DistributionMode.EQUAL && debters.length === 0 && participants?.length) {
      selectAllEligible()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, participants, payers, totalAmount])

  const handleSelectChange = (value: string) => {
    setDebters((prev: any) => {
      const exists = prev.find((debter: any) => debter.userId === value)
      if (exists) {
        return prev.filter((debter: any) => debter.userId !== value)
      }
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

  const isOptionSelected = (value: string): boolean => {
    return !!debters.find((debter: any) => debter.userId === value)
  }

  const handleSubmit = () => {
    setError(null)

    if (debters.length === 0) {
      setError('Selecciona al menos una persona que deba su parte')
      return
    }

    if (!(mode === DistributionMode.EQUAL)) {
      const totalDebtersAmount = debters.reduce((acc: number, debter: any) => acc + debter.amount, 0)

      if (totalDebtersAmount !== totalAmount) {
        setError('Las partes deben sumar el total del gasto')
        return
      }
    }

    const spendingData = {
      ...finalData,
      debters: debters.map((debter: any) => ({
        userId: debter.userId,
        amount: debter.amount
      }))
    }

    setFinalData(spendingData)

    if (onSubmit) {
      onSubmit(spendingData)
    } else {
      nextStep()
    }
  }

  const changeModeSelect = (value: string) => {
    setMode(value as DistributionModeType)
    setDebters([])
    setError(null)
  }

  return (
    <Card className='max-w-[526px] w-full border-0 shadow-none p-0'>
      <CardHeader className='flex justify-between items-center flex-row px-0 pt-0'>
        <div className='flex flex-col'>
          <CardTitle>Quién debe</CardTitle>
          <CardDescription>Elige quién participa en la división y cómo se reparte</CardDescription>
        </div>
        <Badge>${totalAmount}</Badge>
      </CardHeader>
      <CardContent className='px-0'>
        <div className="flex gap-4 items-center flex-wrap">
          <Label>Reparto</Label>
          <Select onValueChange={changeModeSelect} defaultValue={mode}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="equal">Partes iguales</SelectItem>
              <SelectItem value="custom">Montos personalizados</SelectItem>
            </SelectContent>
          </Select>
          {mode === DistributionMode.EQUAL && (
            <Button type="button" variant="secondary" size="sm" onClick={selectAllEligible} disabled={isLoading}>
              Todos excepto quien pagó
            </Button>
          )}
        </div>

        <Separator className="my-4" />

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
          <p className="mt-4 text-muted-foreground text-sm">Nadie seleccionado todavía</p>
        )}

        {error && (
          <p className="text-red-500 mt-4 text-sm">{error}</p>
        )}

        <Button
          onClick={handleSubmit}
          className="mt-4 w-full"
          variant="default"
          disabled={isSubmitting || debters.length === 0}
        >
          {isSubmitting ? 'Guardando…' : submitLabel}
        </Button>

        <Button onClick={prevStep} className="mt-2 w-full" variant="outline" disabled={isSubmitting}>
          Volver
        </Button>
      </CardContent>
    </Card>
  )
}
