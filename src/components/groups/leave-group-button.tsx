'use client'

import { Button } from '@/components/ui/button'
import { displayToast } from '@/utils/toast-display'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useSWRConfig } from 'swr'
import { leaveGroup } from '../../app/(overview)/groups/[groupId]/participants/actions'

export const LeaveGroupButton = ({ groupId }: { groupId: string }) => {
  const router = useRouter()
  const { mutate } = useSWRConfig()
  const [isLoading, setIsLoading] = useState(false)

  const handleOnClick = async () => {
    setIsLoading(true)
    try {
      await leaveGroup(groupId)
      displayToast('Ha abandonado el grupo correctamente. Redirigiendo...', 'success')
      mutate('user-groups')
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (error) {
      console.error(error)
      displayToast('Ha ocurrido un error al intentar abandonar el grupo', 'error')
      setIsLoading(false)
    }
  }

  return (
    <Button variant='destructive' className='ml-auto' onClick={handleOnClick} disabled={isLoading}>
      Abandonar grupo
    </Button>
  )
}
