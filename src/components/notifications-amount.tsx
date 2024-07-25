'use client'

import { getAmountNotifications } from '@/lib/data'
import useSWR from 'swr'
import { buttonVariants } from './ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Bell } from 'lucide-react'

export const NotificationsAmount = ({ userId }: { userId: string }) => {
  const { data: amountNotifications, isLoading } = useSWR(['/api/notifications/amount', userId], async ([_, userId]) => {
    return await getAmountNotifications(userId)
  })

  return (
    <Link className={cn(buttonVariants({ variant: 'outline', size: 'icon' }), 'ml-auto relative')} href="/notifications">
      <Bell className="h-4 w-4" />
      {isLoading
        ? <div className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center bg-black text-white rounded-full animate-pulse">
        <div className="h-2 w-2 bg-white rounded-full"></div>
      </div>
        : <div className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center bg-black text-white rounded-full text-[8px]">
          {amountNotifications}
        </div>}
      <span className="sr-only">Notificaciones</span>
    </Link>
  )
}
