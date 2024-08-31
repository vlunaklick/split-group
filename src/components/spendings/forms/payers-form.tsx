'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { inputStyle } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useStepper } from '@/components/ui/stepper'
import { User } from '@prisma/client'
import { useState } from 'react'
import CurrencyInput from 'react-currency-input-field'

export const PayersForm = ({ participants, isLoading, totalAmount, setFinalData }: { participants?: any[]; isLoading: boolean; totalAmount: number; setFinalData: (data: any) => void }) => {
  const { nextStep, prevStep } = useStepper()
  const [error, setError] = useState<string | null>(null)
  const [payers, setPayers] = useState<{
    userId: string
    amount: number
  }[]>([])

  const handleSelectChange = (value: string) => {
    if (payers.find((payer: any) => payer.userId === value)) {
      setPayers((prev: any) => {
        return prev.filter((payer: any) => payer.userId !== value)
      })
    } else {
      setPayers((prev: any) => {
        return [...prev, { userId: value, amount: 0 }]
      })
    }
  }

  const isOptionSelected = (value: string): boolean => {
    return !!payers.find((payer: any) => payer.userId === value)
  }

  const handleAmountChange = (value: string, userId: string) => {
    setPayers((prev: any) => {
      return prev.map((payer: any) => {
        if (payer.userId === userId) {
          return { userId, amount: parseFloat(value.replace('$', '')) }
        }
        return payer
      })
    })
  }

  const handleNextStep = () => {
    setError(null)

    if (payers.length === 0) {
      setError('Debes seleccionar al menos un contribuyente')
      return
    }

    const totalPayersAmount = payers.reduce((acc: number, payer: any) => acc + payer.amount, 0)

    if (totalPayersAmount !== totalAmount) {
      setError('La suma de los montos de los contribuyentes debe ser igual al monto total')
      return
    }

    setFinalData((prev: any) => {
      return {
        ...prev,
        payers
      }
    })

    nextStep()
  }

  const handlePrevStep = () => {
    prevStep()
  }

  return (
    <Card className='max-w-[526px] w-full'>
      <CardHeader className="flex justify-between items-center flex-row">
        <div className="flex flex-col">
          <CardTitle>Contribuyentes</CardTitle>
          <CardDescription>Selecciona los participantes que contribuirán al gasto</CardDescription>
        </div>
        <Badge>${totalAmount}</Badge>
      </CardHeader>
      <CardContent>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex gap-2 w-full" disabled={isLoading}>
              Seleccionar contribuyentes
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full max-w-[320px]" onCloseAutoFocus={(e) => e.preventDefault()}>
            <DropdownMenuLabel>Participantes</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {participants?.map((participant: User, index: number) => {
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
            }
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator className="my-4" />

        <div className="grid gap-4">
          {payers?.length === 0 && (
            <p>No hay contribuyentes seleccionados</p>
          )}

          {payers?.length > 0 && (
            <>
              {payers.map((payer: any, index: number) => (
                <div key={index} className="gap-4 flex items-center">
                  <Label>@{participants?.find((participant: User) => participant.id === payer.userId)?.username}</Label>
                  <CurrencyInput
                    name={payer.userId}
                    placeholder="$0.00"
                    className={inputStyle}
                    decimalsLimit={2}
                    onChange={(e) => handleAmountChange(e.target.value, payer.userId)}
                  />
                </div>
              ))}

              {error && (
                <p className="text-red-500">{error}</p>
              )}

              <Button variant="default" className="w-full" onClick={handleNextStep}>Continuar</Button>
            </>
          )}

        </div>
        <Button variant="ghost" className="w-full mt-4" onClick={handlePrevStep}>Atrás</Button>
      </CardContent>
    </Card>
  )
}
