import { removeAdminPermission } from '@/app/(overview)/groups/[groupId]/participants/actions'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { toast } from 'sonner'
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
      toast.error('Hubo un error al remover permisos de administrador.', {
        duration: 3000
      })
      return
    }

    toast.success('Permisos de administrador removidos correctamente.', {
      duration: 3000
    })
    setIsLoading(false)
  }

  return (
    <Button variant='outline' onClick={() => revokeAdminPermission(userId)} disabled={isLoading}>
      Remover
    </Button>
  )
}
