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
      displayToast('Te uniste al grupo', 'success')
      mutate('user-groups')
      router.push(`/groups/${groupId}`)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo unir al grupo'
      displayToast(message, 'error')
      setIsLoading(false)
    }
  }

  return (
    <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
      <Button onClick={handleOnClick} className="w-full sm:w-auto" disabled={isLoading}>
        {isLoading ? 'Uniéndote…' : 'Unirme al grupo'}
      </Button>
      <Link
        href="/dashboard"
        className={cn(buttonVariants({ variant: 'outline' }), 'w-full sm:w-auto', isLoading && 'pointer-events-none opacity-50')}
      >
        Ahora no
      </Link>
    </div>
  )
}
