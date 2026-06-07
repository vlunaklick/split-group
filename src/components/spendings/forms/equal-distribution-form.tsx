'use client'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { formatMoney } from '@/lib/money'
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
    <div className="grid gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-between font-normal" disabled={isLoading}>
            {debters.length > 0 ? `${debters.length} participante${debters.length > 1 ? 's' : ''}` : 'Elegir participantes'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]" onCloseAutoFocus={(e) => e.preventDefault()}>
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
        <ul className="surface-panel divide-y divide-border">
          {debters.map((debter: any) => {
            const participant = participants?.find((p: User) => p.id === debter.userId)
            const label = participant ? participantLabel(participant) : '?'

            return (
              <li key={debter.userId} className="flex items-center justify-between gap-3 px-4 py-3">
                <span className="truncate text-sm">{label}</span>
                <span className="shrink-0 font-mono text-sm text-muted-foreground">
                  {formatMoney(debter.amount)}
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
