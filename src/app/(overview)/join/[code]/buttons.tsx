'use client'

import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { displayToast } from '@/utils/toast-display'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useSWRConfig } from 'swr'
import { joinInvitation } from './actions'

export const ActionButtons = ({ code, groupId }: { code: string, groupId: string }) => {
  const router = useRouter()
  const { mutate } = useSWRConfig()
  const [isLoading, setIsLoading] = useState(false)

  const handleOnClick = async () => {
    setIsLoading(true)
    try {
      await joinInvitation(code)
      displayToast('Ha ingresado al grupo correctamente', 'success')
      mutate('user-groups')
      setTimeout(() => {
        router.push(`/groups/${groupId}`)
      }, 2000)
    } catch (error) {
      console.error(error)
      displayToast('Ha ocurrido un error al intentar unirse al grupo', 'error')
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button onClick={handleOnClick} className='mt-4' disabled={isLoading}>
        Unirse al grupo
      </Button>
      <Link href="/dashboard" className={cn(buttonVariants({ variant: 'outline' }), isLoading ? 'pointer-events-none' : '')}>
        Cancelar
      </Link>
    </>
  )
}
