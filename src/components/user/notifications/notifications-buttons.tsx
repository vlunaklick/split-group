'use client'

import { Button } from '@/components/ui/button'
import { markAllAsRead } from '../../../app/(user)/notifications/actions'
import { toast } from 'sonner'
import { useState } from 'react'
import { useSWRConfig } from 'swr'

export const MarkAllAsRead = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { mutate } = useSWRConfig()

  const handleOnClick = async () => {
    setIsLoading(true)
    try {
      await markAllAsRead()
      mutate(['notifications'])
      toast.success('Todas las notificaciones han sido marcadas como leídas')
    } catch (error) {
      console.error(error)
      toast.error('Ha ocurrido un error al marcar todas las notificaciones como leídas')
    }
    setIsLoading(false)
  }

  return (
    <Button onClick={handleOnClick} disabled={isLoading}>
      Marcar todas como leídas
    </Button>
  )
}
