'use client'

import { deleteSpending } from '../../../app/(overview)/groups/[groupId]/spendings/actions'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { useSWRConfig } from 'swr'

export function DeleteSpendingDialog ({ groupId, spendId }: { groupId: string, spendId: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { mutate } = useSWRConfig()

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      await deleteSpending({ spendingId: spendId })
    } catch (error) {
      toast.error('No se ha podido eliminar el gasto')
      setIsLoading(false)
      return
    }

    toast.success('El gasto ha sido eliminado. Redirigiendo...')
    mutate(`/api/groups/${groupId}/spendings`)
    setTimeout(() => {
      router.push(`/groups/${groupId}/spendings`)
    }, 2000)
  }

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
