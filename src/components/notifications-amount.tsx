'use client'

import { useGetAmountNotifications } from '@/data/notifications'
import { cn } from '@/lib/utils'
import { Bell } from 'lucide-react'
import Link from 'next/link'
import { buttonVariants } from './ui/button'

export const NotificationsAmount = () => {
  const { data: notifications, isLoading } = useGetAmountNotifications()

  return (
    <Link className={cn(buttonVariants({ variant: 'outline', size: 'icon' }), 'ml-auto relative')} href="/notifications">
      <Bell className="h-4 w-4" />
      {isLoading
        ? <div className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full animate-pulse bg-card border">
        <div className="h-2 w-2 bg-accent-foreground rounded-full"></div>
      </div>
        : <div className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full text-[8px] bg-card border text-accent-foreground">
          {notifications?.length}
        </div>}
      <span className="sr-only">Notificaciones</span>
    </Link>
  )
}
