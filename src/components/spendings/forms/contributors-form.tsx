'use client'

import { DistributionMode, DistributionModeType } from '@/app/(overview)/groups/[groupId]/spendings/types'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useStepper } from '@/components/ui/stepper'
import { cn } from '@/lib/utils'
import { User } from '@prisma/client'
import { useState } from 'react'

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

  return (
    <Card className='max-w-[526px] w-full'>
      <CardHeader>
        <CardTitle>Deudores</CardTitle>
        <CardDescription>Selecciona los deudores</CardDescription>
      </CardHeader>
      <CardContent>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex gap-2 w-full" disabled={isLoading}>
              Seleccionar deudores
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full max-w-[320px]" onCloseAutoFocus={(e) => e.preventDefault()}>
            <DropdownMenuLabel>Participantes</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {participants?.map((participant: User, index: number) => {
              if (payers?.find((payer: any) => payer.userId === participant.id)) {
                return null
              }

              return (
                <DropdownMenuCheckboxItem
                  onSelect={(e) => e.preventDefault()}
                  key={index}
                  checked={isOptionSelected(participant.id)}
                  onCheckedChange={() => handleSelectChange(participant.id)}
                >
                  @{participant.username} - {participant.email}
                </DropdownMenuCheckboxItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator className="my-4" />

        <div className="flex gap-4 items-center">
          <Label>Modo de distribución</Label>
          <Select onValueChange={(value: string) => setMode(value as DistributionModeType)} defaultValue={mode}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="equal">Igualitaria</SelectItem>
              {/* <SelectItem value="custom">Por monto</SelectItem> */}
            </SelectContent>
          </Select>
        </div>
        {debters.length === 0 && (
          <p className="mt-4">No hay deudores seleccionados</p>
        )}

        {debters.length > 0 && mode === DistributionMode.EQUAL && (
          <div className="grid gap-4 mt-4">
            {debters.map((debter: any, index: number) => (
              <div key={index} className="flex gap-4 items-center p-2">
                <div className={cn(buttonVariants({ variant: 'secondary', size: 'icon' }), 'rounded-full')}>
                  {participants?.find((participant: User) => participant.id === debter.userId)?.username[0]}
                </div>

                <div className="flex flex-col gap-1">
                  <span>{participants?.find((participant: User) => participant.id === debter.userId)?.username}</span>
                  <span className="text-sm text-muted-foreground">
                    {participants?.find((participant: User) => participant.id === debter.userId)?.email}
                  </span>
                </div>
              </div>
            ))}
          </div>
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
