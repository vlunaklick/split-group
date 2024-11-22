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
    } catch (error) {
      displayToast('Ha ocurrido un error al eliminar el gasto.', 'error')
      setIsLoading(false)
      return
    }

    displayToast('Gasto eliminado correctamente.', 'success')
    mutate(`/api/groups/${groupId}/spendings`)
    setTimeout(() => {
      router.push(`/groups/${groupId}/spendings`)
    }, 2000)
  }

  if (!show) return null

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant='destructive'>
          Eliminar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Estas seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Si eliminas este gasto, no podrás recuperarlo.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction onClick={(e) => { e.preventDefault(); handleDelete() }} disabled={isLoading}>
            {
              isLoading
                ? 'Eliminando...'
                : 'Eliminar'
            }
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
