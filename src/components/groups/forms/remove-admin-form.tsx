import { removeAdminPermission } from '@/app/(overview)/groups/[groupId]/participants/actions'
import { Button } from '@/components/ui/button'
import { displayToast } from '@/utils/toast-display'
import { useState } from 'react'
import { useSWRConfig } from 'swr'

export function RemoveAdminForm ({ userId, groupId }: { userId: string, groupId: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const { mutate } = useSWRConfig()

  const revokeAdminPermission = async (userId: string) => {
    setIsLoading(true)
    try {
      await removeAdminPermission(userId, groupId)
      mutate(['/api/groups/admins', groupId])
      mutate(['/api/groups/members-without-admins', groupId])
    } catch (error) {
      displayToast('Hubo un error al remover permisos de administrador.', 'error')
      return
    }

    displayToast('Permisos de administrador removidos correctamente.', 'success')
    setIsLoading(false)
  }

  return (
    <Button variant='outline' onClick={() => revokeAdminPermission(userId)} disabled={isLoading}>
      Remover
    </Button>
  )
}
