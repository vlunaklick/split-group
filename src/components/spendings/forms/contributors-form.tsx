'use client'

import { DistributionMode, DistributionModeType } from '@/app/(overview)/groups/[groupId]/spendings/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useStepper } from '@/components/ui/stepper'
import { useState } from 'react'
import { EqualDistributionForm } from './equal-distribution-form'
import { CustomDistributionForm } from './custom-distribution-form'
import { Badge } from '@/components/ui/badge'

export const DebtersForm = ({ participants, isLoading, totalAmount, payers, setFinalData, mode, setMode }: { participants?: any[]; isLoading: boolean; totalAmount: number; payers: any; setFinalData: (data: any) => void, mode: DistributionModeType, setMode: (mode: DistributionModeType) => void }) => {
  const { nextStep, prevStep } = useStepper()
  const [error, setError] = useState<string | null>(null)
  const [debters, setDebters] = useState<{
    userId: string
    amount: number
  }[]>([])

  const handleSelectChange = (value: string) => {
    if (debters.find((debter: any) => debter.userId === value)) {
      setDebters((prev: any) => {
        return prev.filter((debter: any) => debter.userId !== value)
      })
    } else {
      setDebters((prev: any) => {
        return [...prev, { userId: value, amount: 0 }]
      })
    }
  }

  const isOptionSelected = (value: string): boolean => {
    return !!debters.find((debter: any) => debter.userId === value)
  }

  const handleNextStep = () => {
    if (debters.length === 0) {
      setError('Debes seleccionar al menos un contribuyente')
      return
    }

    if (!(mode === DistributionMode.EQUAL)) {
      const totalDebtersAmount = debters.reduce((acc: number, debter: any) => acc + debter.amount, 0)

      if (totalDebtersAmount !== totalAmount) {
        setError('La suma de los montos de los contribuyentes debe ser igual al monto total')
        return
      }
    }

    setFinalData((prev: any) => {
      return {
        ...prev,
        debters: debters.map((debter: any) => {
          return {
            userId: debter.userId,
            amount: debter.amount
          }
        })
      }
    })

    nextStep()
  }

  const handlePrevStep = () => {
    prevStep()
  }

  const changeModeSelect = (value: string) => {
    setMode(value as DistributionModeType)
    setDebters([])
  }

  return (
    <Card className='max-w-[526px] w-full'>
      <CardHeader className='flex justify-between items-center flex-row'>
        <div className='flex flex-col'>
          <CardTitle>Deudores</CardTitle>
          <CardDescription>Selecciona los deudores</CardDescription>
        </div>
        <Badge>${totalAmount}</Badge>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 items-center">
          <Label>Modo de distribución</Label>
          <Select onValueChange={changeModeSelect} defaultValue={mode}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="equal">Igualitaria</SelectItem>
              <SelectItem value="custom">Por monto</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator className="my-4" />

        {mode === DistributionMode.EQUAL && (
          <EqualDistributionForm debters={debters} participants={participants} isLoading={isLoading} payers={payers} handleSelectChange={handleSelectChange} isOptionSelected={isOptionSelected} totalAmount={totalAmount} setDebters={setDebters} />
        )}

        {mode === DistributionMode.CUSTOM && (
          <CustomDistributionForm debters={debters} setDebters={setDebters} isLoading={isLoading} participants={participants} isOptionSelected={isOptionSelected} handleSelectChange={handleSelectChange} />
        )}

        {debters.length === 0 && (
          <p className="mt-4">No hay deudores seleccionados</p>
        )}

        {debters.length > 0 && (
          <>
            {error && (
              <p className="text-red-500 mt-4">{error}</p>
            )}

            <Button onClick={handleNextStep} className="mt-4 w-full" variant="default">
              Continuar
            </Button>
          </>
        )}

        <Button onClick={handlePrevStep} className="mt-4 w-full" variant="outline">
          Volver
        </Button>
      </CardContent>
    </Card>
  )
}
