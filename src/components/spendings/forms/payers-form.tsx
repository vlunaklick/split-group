'use client'

import { NumberField, NumberFieldDecrement, NumberFieldGroup, NumberFieldIncrement, NumberFieldInput } from '@/components/number-field'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useStepper } from '@/components/ui/stepper'
import { useGetSession } from '@/data/session'
import { formatMoney } from '@/lib/money'
import { User } from '@prisma/client'
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export const PayersForm = ({ participants, isLoading, totalAmount, setFinalData, initialPayers }: {
  participants?: any[]
  isLoading: boolean
  totalAmount: number
  setFinalData: (data: any) => void
  initialPayers?: { userId: string, amount: number }[]
}) => {
  const { nextStep, prevStep } = useStepper()
  const { data: session } = useGetSession()
  const [error, setError] = useState<string | null>(null)
  const [payers, setPayers] = useState<{ userId: string, amount: number }[]>(initialPayers ?? [])
  const autoFilled = useRef(Boolean(initialPayers?.length))

  const currentUserId = session?.user?.id as string | undefined

  useEffect(() => {
    if (initialPayers?.length) {
      setPayers(initialPayers)
      autoFilled.current = true
    }
  }, [initialPayers])

  useEffect(() => {
    if (autoFilled.current || initialPayers?.length || !currentUserId || totalAmount <= 0) return
    setPayers([{ userId: currentUserId, amount: totalAmount }])
    autoFilled.current = true
  }, [currentUserId, totalAmount, initialPayers?.length])

  const handleSelectChange = (value: string) => {
    if (payers.find((payer) => payer.userId === value)) {
      setPayers((prev) => prev.filter((payer) => payer.userId !== value))
    } else {
      setPayers((prev) => [...prev, { userId: value, amount: 0 }])
    }
    setError(null)
  }

  const isOptionSelected = (value: string) => !!payers.find((payer) => payer.userId === value)

  const handleAmountChange = (value: number, userId: string) => {
    setPayers((prev) => prev.map((payer) => (
      payer.userId === userId ? { userId, amount: value } : payer
    )))
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
    setPayers((prev) => prev.map((payer) => ({ ...payer, amount: share })))
    setError(null)
  }

  const handleNextStep = () => {
    setError(null)

    if (payers.length === 0) {
      setError('Elegí quién pagó')
      return
    }

    const totalPayersAmount = payers.reduce((acc, payer) => acc + payer.amount, 0)

    if (totalPayersAmount !== totalAmount) {
      setError(`Los pagos deben sumar ${formatMoney(totalAmount)}`)
      return
    }

    setFinalData((prev: any) => ({ ...prev, payers }))
    nextStep()
  }

  const participantLabel = (participant: User) => participant.name ?? participant.username

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">Total del gasto</p>
        <Badge variant="secondary" className="font-mono">{formatMoney(totalAmount)}</Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        {currentUserId && (
          <Button
            type="button"
            variant={payers.length === 1 && payers[0]?.userId === currentUserId ? 'default' : 'secondary'}
            size="sm"
            onClick={handlePayAllMyself}
            disabled={isLoading}
          >
            Yo pagué todo
          </Button>
        )}
        {payers.length > 1 && (
          <Button type="button" variant="secondary" size="sm" onClick={handleSplitEqually}>
            Repartir el pago
          </Button>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full" disabled={isLoading}>
            {payers.length > 0 ? `${payers.length} pagador${payers.length > 1 ? 'es' : ''}` : 'Elegir quién pagó'}
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

      <Separator />

      {payers.length === 0 && (
        <p className="text-sm text-muted-foreground">Usá &quot;Yo pagué todo&quot; o elegí pagadores</p>
      )}

      {payers.map((payer) => (
        <div key={payer.userId} className="flex items-center gap-4">
          <Label className="min-w-0 truncate">
            {participantLabel(participants?.find((p: User) => p.id === payer.userId) as User)}
          </Label>
          <NumberField
            className="ml-auto"
            minValue={0}
            value={payer.amount}
            onChange={(value) => handleAmountChange(value, payer.userId)}
          >
            <NumberFieldGroup>
              <NumberFieldIncrement><ChevronUpIcon /></NumberFieldIncrement>
              <NumberFieldInput />
              <NumberFieldDecrement><ChevronDownIcon /></NumberFieldDecrement>
            </NumberFieldGroup>
          </NumberField>
        </div>
      ))}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button variant="default" className="w-full" onClick={handleNextStep} disabled={payers.length === 0}>
        Continuar
      </Button>
      <Button variant="ghost" className="w-full" onClick={prevStep}>Atrás</Button>
    </div>
  )
}
