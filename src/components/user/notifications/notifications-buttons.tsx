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
      mutate(['group-notifications'])
      displayToast('Todos los avisos marcados como leídos', 'success')
    } catch (error) {
      displayToast('No se pudieron marcar los avisos', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleOnClick} disabled={isLoading}>
      {isLoading ? 'Marcando…' : 'Marcar todo leído'}
    </Button>
  )
}
