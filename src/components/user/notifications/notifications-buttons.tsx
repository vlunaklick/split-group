'use client'

import { Button } from '@/components/ui/button'
import { displayToast } from '@/utils/toast-display'
import { useState } from 'react'
import { useSWRConfig } from 'swr'
import { markAllAsRead } from '../../../app/(user)/notifications/actions'

export const MarkAllAsRead = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { mutate } = useSWRConfig()

  const handleOnClick = async () => {
    setIsLoading(true)
    try {
      await markAllAsRead()
      mutate(['notifications'])
      displayToast('Todas las notificaciones han sido marcadas como leídas', 'success')
    } catch (error) {
      console.error(error)
      displayToast('Ha ocurrido un error al marcar todas las notificaciones como leídas', 'error')
    }
    setIsLoading(false)
  }

  return (
    <Button onClick={handleOnClick} disabled={isLoading}>
      Marcar todas como leídas
    </Button>
  )
}
