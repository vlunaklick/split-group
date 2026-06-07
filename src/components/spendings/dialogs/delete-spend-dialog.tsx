'use client'

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { displayToast } from '@/utils/toast-display'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useSWRConfig } from 'swr'
import { deleteSpending } from '../../../app/(overview)/groups/[groupId]/spendings/actions'

export function DeleteSpendingDialog ({ groupId, spendId, show }: { groupId: string, spendId: string, show: boolean }) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { mutate } = useSWRConfig()

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      await deleteSpending({ spendingId: spendId })
      displayToast('Gasto eliminado', 'success')
      mutate(['last-spendings', groupId])
      mutate(['debts', groupId])
      mutate(['spendings-table', groupId])
      router.push(`/groups/${groupId}/spendings`)
    } catch (error) {
      displayToast('No se pudo eliminar el gasto', 'error')
      setIsLoading(false)
    }
  }

  if (!show) return null

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          Eliminar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar este gasto?</AlertDialogTitle>
          <AlertDialogDescription>
            Se borran también pagos y deudas asociados. No se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => { e.preventDefault(); handleDelete() }}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? 'Eliminando…' : 'Eliminar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
