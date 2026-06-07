'use client'

import { forgiveAllDebt } from '@/app/(overview)/groups/[groupId]/actions'
import { forgiveDebt } from '@/app/(overview)/groups/[groupId]/spendings/actions'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { formatMoney } from '@/lib/money'
import { displayToast } from '@/utils/toast-display'
import { useState } from 'react'
import { useSWRConfig } from 'swr'

export function ForgiveDebtDialog ({
  groupId,
  debterId,
  debterName,
  amount,
  debtId,
  spendId,
  triggerVariant = 'ghost',
  triggerClassName
}: {
  groupId: string
  debterName: string
  amount: number
  debterId?: string
  debtId?: string
  spendId?: string
  triggerVariant?: 'ghost' | 'outline'
  triggerClassName?: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { mutate } = useSWRConfig()

  const refreshCaches = () => {
    mutate(['debts', groupId])
    mutate(['group-settlement', groupId])
    mutate(['group-settlement-history', groupId])
    mutate(['group-activity', groupId])
    mutate('user-onboarding')
    mutate(['group-onboarding', groupId])

    if (spendId) {
      mutate(['owed-debts', groupId, spendId])
    }
  }

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      if (debtId) {
        await forgiveDebt({ debtId })
      } else if (debterId) {
        await forgiveAllDebt({ groupId, debterId })
      } else {
        throw new Error('No se pudo identificar la deuda')
      }

      displayToast('Deuda perdonada', 'success')
      refreshCaches()
      setIsOpen(false)
    } catch {
      displayToast('No se pudo perdonar la deuda', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button
        variant={triggerVariant}
        size="sm"
        className={triggerClassName ?? (triggerVariant === 'ghost' ? 'h-8 px-2 text-xs' : undefined)}
        onClick={() => setIsOpen(true)}
      >
        Perdonar
      </Button>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Perdonar esta deuda?</AlertDialogTitle>
            <AlertDialogDescription>
              Vas a perdonar {formatMoney(amount)} que te debe {debterName}. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction disabled={isLoading} onClick={(event) => {
              event.preventDefault()
              void handleConfirm()
            }}>
              {isLoading ? 'Perdonando…' : 'Sí, perdonar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
