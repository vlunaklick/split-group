'use client'

import { ChecklistItem } from '@/components/onboarding/checklist-item'
import { CreateGroupSheet } from '@/components/groups/sheets/create-group-sheet'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetUserOnboarding } from '@/data/onboarding'
import { dismissUserOnboarding, isUserOnboardingDismissed } from '@/lib/onboarding-storage'
import { X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSWRConfig } from 'swr'

type Progress = {
  hasGroup: boolean
  hasSpending: boolean
  hasMarkedPayment: boolean
  complete: boolean
}

export function UserOnboardingChecklist () {
  const { data, isLoading } = useGetUserOnboarding()
  const { mutate } = useSWRConfig()
  const [dismissed, setDismissed] = useState(true)

  useEffect(() => {
    setDismissed(isUserOnboardingDismissed())
  }, [])

  const progress = data as Progress | undefined

  if (isLoading) {
    return (
      <div className="surface-panel grid gap-3 p-4">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  if (!progress || progress.complete || dismissed) return null

  const completedCount = [progress.hasGroup, progress.hasSpending, progress.hasMarkedPayment].filter(Boolean).length

  const handleDismiss = () => {
    dismissUserOnboarding()
    setDismissed(true)
  }

  return (
    <section className="surface-panel grid gap-4 border-primary/20 bg-primary/5 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="grid gap-1">
          <p className="text-sm font-medium">Primeros pasos</p>
          <p className="text-sm text-muted-foreground">
            {completedCount} de 3 listos — en un minuto tenés todo andando.
          </p>
        </div>
        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={handleDismiss} aria-label="Ocultar guía">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ul className="grid gap-2">
        <ChecklistItem
          done={progress.hasGroup}
          label="Creá o unite a un grupo"
          description="Un espacio para compartir gastos con otras personas."
          action={!progress.hasGroup
            ? <CreateGroupSheet triggerVariant="outline" triggerLabel="Crear grupo" className="h-8 text-xs" />
            : undefined}
        />
        <ChecklistItem
          done={progress.hasSpending}
          label="Registrá un gasto"
          description="Comida, alquiler, viaje — lo que hayan pagado entre varios."
          action={progress.hasGroup && !progress.hasSpending
            ? (
              <Button variant="outline" size="sm" className="h-8 text-xs" asChild>
                <Link href="/dashboard">Ir a mis grupos</Link>
              </Button>
              )
            : undefined}
        />
        <ChecklistItem
          done={progress.hasMarkedPayment}
          label="Marcá un pago"
          description="Cuando transferís, marcá la deuda como pagada (podés adjuntar comprobante)."
          action={progress.hasSpending && !progress.hasMarkedPayment
            ? (
              <Button variant="outline" size="sm" className="h-8 text-xs" asChild>
                <Link href="/dashboard">Ver pendientes</Link>
              </Button>
              )
            : undefined}
        />
      </ul>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 w-fit text-xs text-muted-foreground"
        onClick={() => mutate('user-onboarding')}
      >
        Actualizar progreso
      </Button>
    </section>
  )
}
