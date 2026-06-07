'use client'

import { ChecklistItem } from '@/components/onboarding/checklist-item'
import { CreateSpendingSheet } from '@/components/spendings/sheets/create-spending-sheet'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetGroupOnboarding } from '@/data/onboarding'
import { dismissGroupOnboarding, isGroupOnboardingDismissed } from '@/lib/onboarding-storage'
import { X } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSWRConfig } from 'swr'

type Progress = {
  hasSpending: boolean
  hasInvited: boolean
  hasMarkedPayment: boolean
  complete: boolean
  memberCount: number
}

export function GroupOnboardingChecklist ({ groupId }: { groupId: string }) {
  const searchParams = useSearchParams()
  const { data, isLoading } = useGetGroupOnboarding({ groupId })
  const { mutate } = useSWRConfig()
  const [dismissed, setDismissed] = useState(true)
  const justJoined = searchParams.get('joined') === '1'

  useEffect(() => {
    setDismissed(isGroupOnboardingDismissed(groupId))
  }, [groupId])

  const progress = data as Progress | undefined

  if (isLoading) {
    return (
      <div className="surface-panel grid gap-3 p-4">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  if (!progress || progress.complete) return null
  if (dismissed && !justJoined) return null

  const completedCount = [progress.hasSpending, progress.hasInvited, progress.hasMarkedPayment].filter(Boolean).length

  const handleDismiss = () => {
    dismissGroupOnboarding(groupId)
    setDismissed(true)
  }

  return (
    <section className="surface-panel grid gap-4 border-primary/20 bg-primary/5 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="grid gap-1">
          <p className="text-sm font-medium">
            {justJoined ? 'Empezá en este grupo' : 'Completá el grupo'}
          </p>
          <p className="text-sm text-muted-foreground">
            {completedCount} de 3 · {progress.memberCount} {progress.memberCount === 1 ? 'persona' : 'personas'} por ahora
          </p>
        </div>
        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={handleDismiss} aria-label="Ocultar guía">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ul className="grid gap-2">
        <ChecklistItem
          done={progress.hasSpending}
          label="Cargá un gasto"
          description="El primero puede ser chico — un supermercado o la cena."
          action={!progress.hasSpending
            ? <CreateSpendingSheet groupId={groupId} variant="outline" className="h-8 text-xs" />
            : undefined}
        />
        <ChecklistItem
          done={progress.hasInvited}
          label="Sumá a alguien más"
          description="Compartí el link de invitación desde Participantes."
          action={!progress.hasInvited
            ? (
              <Button variant="outline" size="sm" className="h-8 text-xs" asChild>
                <Link href={`/groups/${groupId}/participants`}>Invitar</Link>
              </Button>
              )
            : undefined}
        />
        <ChecklistItem
          done={progress.hasMarkedPayment}
          label="Marcá un pago"
          description="Cuando alguien te transfiere, usá Pagado en el panel de balance."
          action={progress.hasSpending && !progress.hasMarkedPayment
            ? (
              <Button variant="outline" size="sm" className="h-8 text-xs" asChild>
                <Link href="#group-settlement">Ver balance</Link>
              </Button>
              )
            : undefined}
        />
      </ul>
    </section>
  )
}
