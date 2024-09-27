'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { User } from '@prisma/client'

interface EqualDistributionFormProps {
  debters: any[]
  setDebters: (debters: any) => void
  participants?: any[]
  isLoading: boolean
  payers: any[]
  handleSelectChange: (value: string) => void
  isOptionSelected: (value: string) => boolean
  totalAmount: number
}

export function EqualDistributionForm ({ setDebters, totalAmount, debters, participants, isLoading, payers, handleSelectChange, isOptionSelected }: EqualDistributionFormProps) {
  const handleUserSelection = (userId: string) => {
    handleSelectChange(userId)

    const amount = totalAmount / debters.length

    setDebters((prev: any) => {
      return prev.map((debter: any) => {
        return {
          userId: debter.userId,
          amount
        }
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
            if (payers?.find((payer: any) => payer.userId === participant.id)) {
              return null
            }

            return (
              <DropdownMenuCheckboxItem
                onSelect={(e) => e.preventDefault()}
                key={index}
                checked={isOptionSelected(participant.id)}
                onCheckedChange={() => handleUserSelection(participant.id)}
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
            </div>
          ))}
        </div>
      )}
    </>
  )
}
