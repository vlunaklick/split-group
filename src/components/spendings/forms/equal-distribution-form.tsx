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

export function EqualDistributionForm ({
  totalAmount,
  debters,
  participants,
  isLoading,
  payers,
  handleSelectChange,
  isOptionSelected
}: EqualDistributionFormProps) {
  const participantLabel = (participant: User) => participant.name ?? participant.username

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex gap-2 w-full" disabled={isLoading}>
            Seleccionar participantes
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full max-w-[320px]" onCloseAutoFocus={(e) => e.preventDefault()}>
          <DropdownMenuLabel>Participantes</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {participants?.map((participant: User) => {
            if (payers?.find((payer: any) => payer.userId === participant.id)) {
              return null
            }

            return (
              <DropdownMenuCheckboxItem
                onSelect={(e) => e.preventDefault()}
                key={participant.id}
                checked={isOptionSelected(participant.id)}
                onCheckedChange={() => handleSelectChange(participant.id)}
              >
                {participantLabel(participant)}
              </DropdownMenuCheckboxItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {debters.length > 0 && (
        <div className="grid gap-4 mt-4">
          {debters.map((debter: any) => {
            const participant = participants?.find((p: User) => p.id === debter.userId)
            const label = participant ? participantLabel(participant) : '?'

            return (
              <div key={debter.userId} className="flex gap-4 items-center p-2">
                <Avatar>
                  <AvatarFallback>{(label || '?')[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1 flex-1">
                  <span>{label}</span>
                  <span className="text-sm text-muted-foreground">
                    ${debter.amount} de ${totalAmount}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
