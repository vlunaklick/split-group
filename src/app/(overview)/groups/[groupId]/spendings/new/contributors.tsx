'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useStepper } from '@/components/ui/stepper'
import { User } from '@prisma/client'
import { useState } from 'react'

export const DebtersForm = ({ participants, isLoading, totalAmount, payers, setFinalData }: { participants?: any[]; isLoading: boolean; totalAmount: number; payers: any; setFinalData: (data: any) => void }) => {
  const { nextStep, prevStep } = useStepper()
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<'equal' | 'custom'>('equal')
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

    const totalDebtersAmount = debters.reduce((acc: number, debter: any) => {
      if (mode === 'equal') {
        return acc + totalAmount / debters.length
      }

      return acc + debter.amount
    }, 0)

    if (totalDebtersAmount > totalAmount) {
      setError('La suma de los montos de los contribuyentes debe ser igual o menor al monto total')
      return
    }

    setFinalData((prev: any) => {
      return {
        ...prev,
        debters: debters.map((debter: any) => {
          if (mode === 'equal') {
            return {
              userId: debter.userId,
              amount: totalAmount / debters.length
            }
          }

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
          <Select onValueChange={(value: string) => setMode(value as 'equal' | 'custom')} defaultValue={mode}>
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

        {debters.length > 0 && mode === 'equal' && (
          <div className="grid gap-4 mt-4">
            {debters.map((debter: any, index: number) => (
              <div key={index} className="flex items-center w-full">
                <div className="gap-4 flex items-center border-l border-y border-zinc-800 p-2 rounded-l-md w-3/4">
                  <p>@{participants?.find((participant: User) => participant.id === debter.userId)?.username}</p>
                </div>
                <div className="gap-4 flex border border-zinc-800 p-2 rounded-r-md w-1/4 justify-end">
                  <p>${totalAmount ? (totalAmount / debters.length).toFixed(2) : 0}</p>
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
