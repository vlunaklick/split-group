'use client'

import { NumberField, NumberFieldDecrement, NumberFieldGroup, NumberFieldIncrement, NumberFieldInput } from '@/components/number-field'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { User } from '@prisma/client'
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react'

interface CustomDistributionFormProps {
  participants?: any[]
  isLoading: boolean
  debters: any[]
  setDebters: (debters: any) => void
  isOptionSelected: (value: string) => boolean
  handleSelectChange: (value: string) => void
}

export function CustomDistributionForm ({ debters, setDebters, isLoading, participants, isOptionSelected, handleSelectChange }: CustomDistributionFormProps) {
  const handleChangeUserAmount = (userId: string, amount: number) => {
    setDebters((prev: any) => {
      return prev.map((debter: any) => {
        if (debter.userId === userId) {
          return {
            userId,
            amount
          }
        }

        return debter
      })
    })
  }

  return (
    <>
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

      {debters.length > 0 && (
        <div className="grid gap-4 mt-4">
          {debters.map((debter: any, index: number) => (
            <div key={index} className="flex gap-4 items-center p-2">
              <Avatar>
                <AvatarFallback>
                  {participants?.find((participant: User) => participant.id === debter.userId)?.username[0]}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col gap-1">
                <span>{participants?.find((participant: User) => participant.id === debter.userId)?.username}</span>
                <span className="text-sm text-muted-foreground">
                  {participants?.find((participant: User) => participant.id === debter.userId)?.email}
                </span>
              </div>

              <NumberField
                minValue={0}
                className='ml-auto w-30'
                value={debter.amount}
                onChange={(value) => handleChangeUserAmount(debter.userId, value)}
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
        </div>
      )}
    </>
  )
}
