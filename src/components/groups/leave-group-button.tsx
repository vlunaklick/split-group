'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useSWRConfig } from 'swr'
import { leaveGroup } from '../../app/(overview)/groups/[groupId]/participants/actions'
import { toast } from 'sonner'

export const LeaveGroupButton = ({ groupId }: { groupId: string }) => {
  const router = useRouter()
  const { mutate } = useSWRConfig()
  const [isLoading, setIsLoading] = useState(false)

  const handleOnClick = async () => {
    setIsLoading(true)
    try {
      await leaveGroup(groupId)
      toast.success('Ha abandonado el grupo correctamente. Redirigiendo...')
      mutate('user-groups')
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (error) {
      console.error(error)
      toast.error('Ha ocurrido un error al intentar abandonar el grupo')
      setIsLoading(false)
    }
  }

  return (
    <Button variant='destructive' className='ml-auto' onClick={handleOnClick} disabled={isLoading}>
      Abandonar grupo
    </Button>
  )
}
