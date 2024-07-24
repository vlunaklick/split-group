'use client'

import { Button, buttonVariants } from '@/components/ui/button'
import { joinInvitation } from './actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSWRConfig } from 'swr'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export const ActionButtons = ({ code, userId, groupId }: { code: string, userId: string, groupId: string }) => {
  const router = useRouter()
  const { mutate } = useSWRConfig()
  const [isLoading, setIsLoading] = useState(false)

  const handleOnClick = async () => {
    setIsLoading(true)
    try {
      await joinInvitation(code, userId)
      toast.success('Ha ingresado al grupo correctamente. Redirigiendo...')
      mutate('user-groups')
      setTimeout(() => {
        router.push(`/groups/${groupId}`)
      }, 2000)
    } catch (error) {
      console.error(error)
      toast.error('Ha ocurrido un error al intentar unirse al grupo')
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
