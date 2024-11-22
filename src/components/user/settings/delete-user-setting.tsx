'use client'

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { displayToast } from '@/utils/toast-display'
import { deleteUser } from '../../../app/(user)/settings/actions'

export const DeleteSetting = () => {
  const handleDelete = async () => {
    try {
      await deleteUser()
    } catch (error) {
      displayToast('No se ha podido desactivar tu cuenta', 'error')
      return
    }

    displayToast('Tu cuenta ha sido desactivada.', 'success')
  }

  return (
    <Card className='border-red-500 dark:border-red-950'>
      <CardHeader>
        <CardTitle>Desactivar cuenta</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          Una vez desactivada, tu cuenta no podrá ser utilizada para acceder a la plataforma.
        </p>
      </CardContent>
      <CardFooter className="border-t px-6 py-4 flex justify-end border-red-500 bg-red-800/20 rounded-b-md dark:border-red-950">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant='destructive'>
            Desactivar
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Estas seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Tu cuenta será desactivada y no podrás acceder a la plataforma.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button variant='destructive' onClick={handleDelete}>
                Desactivar
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </CardFooter>
    </Card>
  )
}
