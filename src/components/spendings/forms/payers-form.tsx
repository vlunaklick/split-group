'use client'

import { NumberField, NumberFieldDecrement, NumberFieldGroup, NumberFieldIncrement, NumberFieldInput } from '@/components/number-field'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useStepper } from '@/components/ui/stepper'
import { useGetSession } from '@/data/session'
import { User } from '@prisma/client'
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react'
import { useState } from 'react'

export const PayersForm = ({ participants, isLoading, totalAmount, setFinalData }: { participants?: any[]; isLoading: boolean; totalAmount: number; setFinalData: (data: any) => void }) => {
  const { nextStep, prevStep } = useStepper()
  const { data: session } = useGetSession()
  const [error, setError] = useState<string | null>(null)
  const [payers, setPayers] = useState<{
    userId: string
    amount: number
  }[]>([])

  const currentUserId = session?.user?.id as string | undefined

  const handleSelectChange = (value: string) => {
    if (payers.find((payer: any) => payer.userId === value)) {
      setPayers((prev: any) => prev.filter((payer: any) => payer.userId !== value))
    } else {
      setPayers((prev: any) => [...prev, { userId: value, amount: 0 }])
    }
    setError(null)
  }

  const isOptionSelected = (value: string): boolean => {
    return !!payers.find((payer: any) => payer.userId === value)
  }

  const handleAmountChange = (value: number, userId: string) => {
    setPayers((prev: any) => {
      return prev.map((payer: any) => {
        if (payer.userId === userId) {
          return { userId, amount: value }
        }
        return payer
      })
    })
    setError(null)
  }

  const handlePayAllMyself = () => {
    if (!currentUserId) return
    setPayers([{ userId: currentUserId, amount: totalAmount }])
    setError(null)
  }

  const handleSplitEqually = () => {
    if (payers.length === 0) return
    const share = Math.round(totalAmount / payers.length)
    setPayers((prev: any) => prev.map((payer: any) => ({ ...payer, amount: share })))
    setError(null)
  }

  const handleNextStep = () => {
    setError(null)

    if (payers.length === 0) {
      setError('Selecciona al menos una persona que haya pagado')
      return
    }

    const totalPayersAmount = payers.reduce((acc: number, payer: any) => acc + payer.amount, 0)

    if (totalPayersAmount !== totalAmount) {
      setError('Los montos pagados deben sumar el total del gasto')
      return
    }

    setFinalData((prev: any) => ({
      ...prev,
      payers
    }))

    nextStep()
  }

  const participantLabel = (participant: User) => {
    return participant.name ?? participant.username
  }

  return (
    <Card className='max-w-[526px] w-full border-0 shadow-none p-0'>
      <CardHeader className="flex justify-between items-center flex-row px-0 pt-0">
        <div className="flex flex-col">
          <CardTitle>Quién pagó</CardTitle>
          <CardDescription>Indica quién puso el dinero y cuánto aportó cada uno</CardDescription>
        </div>
        <Badge>${totalAmount}</Badge>
      </CardHeader>
      <CardContent className="px-0">
        <div className="flex flex-wrap gap-2 mb-4">
          {currentUserId && (
            <Button type="button" variant="secondary" size="sm" onClick={handlePayAllMyself} disabled={isLoading}>
              Yo pagué todo
            </Button>
          )}
          {payers.length > 1 && (
            <Button type="button" variant="secondary" size="sm" onClick={handleSplitEqually}>
              Dividir pago equitativamente
            </Button>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex gap-2 w-full" disabled={isLoading}>
              Seleccionar quienes pagaron
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full max-w-[320px]" onCloseAutoFocus={(e) => e.preventDefault()}>
            <DropdownMenuLabel>Participantes</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {participants?.map((participant: User) => (
              <DropdownMenuCheckboxItem
                onSelect={(e) => e.preventDefault()}
                key={participant.id}
                checked={isOptionSelected(participant.id)}
                onCheckedChange={() => handleSelectChange(participant.id)}
              >
                {participantLabel(participant)}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator className="my-4" />

        <div className="grid gap-4">
          {payers?.length === 0 && (
            <p className="text-muted-foreground text-sm">Nadie seleccionado todavía — usa un atajo o selecciona participantes</p>
          )}

          {payers.map((payer: any) => (
            <div key={payer.userId} className="gap-4 flex items-center">
              <Label>{participantLabel(participants?.find((p: User) => p.id === payer.userId) as User)}</Label>
              <NumberField
                className='ml-auto'
                minValue={0}
                value={payer.amount}
                onChange={(value) => handleAmountChange(value, payer.userId)}
              >
                <NumberFieldGroup>
                  <NumberFieldIncrement>
                    <ChevronUpIcon />
                  </NumberFieldIncrement>
                  <NumberFieldInput />
                  <NumberFieldDecrement>
                    <ChevronDownIcon />
                  </NumberFieldDecrement>
                </NumberFieldGroup>
              </NumberField>
            </div>
          ))}

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <Button variant="default" className="w-full" onClick={handleNextStep} disabled={payers.length === 0}>
            Continuar
          </Button>
        </div>
        <Button variant="ghost" className="w-full mt-2" onClick={prevStep}>Atrás</Button>
      </CardContent>
    </Card>
  )
}
