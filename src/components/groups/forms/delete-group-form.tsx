import { deleteGroup } from '@/app/(overview)/groups/[groupId]/actions'
import { Button } from '@/components/ui/button'
import { useGetIsGroupOwner } from '@/data/groups'
import { displayToast } from '@/utils/toast-display'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useSWRConfig } from 'swr'

export function DeleteGroupForm ({ groupId }: { groupId: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const { mutate } = useSWRConfig()
  const router = useRouter()
  const { data: isGroupOwner, isLoading: isLoadingOwner } = useGetIsGroupOwner({ groupId })

  const onDelete = async () => {
    setIsLoading(true)
    try {
      await deleteGroup(groupId)
      mutate(['user-groups'])
      displayToast('Grupo eliminado correctamente. Redirigiendo...', 'success')
      setTimeout(() => {
        router.push('/dashboard')
      }, 3000)
    } catch (error) {
      console.error(error)
      displayToast('Ha ocurrido un error al eliminar el grupo.', 'error')
    }
  }

  if (!isGroupOwner || isLoadingOwner) {
    return null
  }

  return (
    <Button variant="destructive" disabled={!isGroupOwner || isLoading} onClick={onDelete} className='w-full'>
      Eliminar grupo
    </Button>
  )
}
