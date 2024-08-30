'use client'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetGroupNotifications, useGetNotifications } from '@/data/notifications'
import { cn } from '@/lib/utils'
import { useTimeAgo } from '@/utils/time'
import { Notification } from '@prisma/client'
import { IconUsers } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { useSWRConfig } from 'swr'
import { deleteNotification, joinGroup, markAsRead, rejectGroup } from '../../../app/(user)/notifications/actions'
import { NotificationWithGroups } from '../../../app/(user)/notifications/types'

export const ListNotifications = () => {
  const { data: notifications, isLoading: isLoadingNotifications } = useGetNotifications()
  const { data: groupNotifications, isLoading: isGroupNotifications } = useGetGroupNotifications()

  return (
    <>
      <h2 className="text-sm font-medium">Invitaciones a grupos</h2>

      <div className="grid gap-3 w-full">
        {groupNotifications?.map((notification: NotificationWithGroups) => (
          <GroupNotification key={notification.id} notification={notification} />
        ))}

        {groupNotifications?.length === 0 && <p className="text-zinc-500">No tienes invitaciones a grupos</p>}

        {isGroupNotifications && (
          <>
            <NotificationSkeleton />
            <NotificationSkeleton />
          </>
        )}
      </div>

      <h2 className="text-sm font-medium">Otras notificaciones</h2>

      <div className="grid gap-3 w-full">
        {notifications?.map((notification: Notification) => (
          <GenericNotification key={notification.id} notification={notification} />
        ))}
        {notifications?.length === 0 && <p className="text-zinc-500">No tienes notificaciones</p>}
        {isLoadingNotifications && (
          <>
            <NotificationSkeleton />
            <NotificationSkeleton />
          </>
        )}
      </div>
    </>
  )
}

export const GroupNotification = ({ notification }: { notification: NotificationWithGroups }) => {
  const { mutate } = useSWRConfig()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleJoinGroup = async () => {
    setIsLoading(true)
    try {
      await joinGroup(notification?.group?.id as string)
      mutate(['notifications'])
      mutate('user-groups')
      mutate(['group-notifications'])
      toast.success('Te has unido al grupo! Redirigiendo...')
      setTimeout(() => {
        router.push(`/groups/${notification?.group?.id}`)
      })
    } catch (error) {
      toast.error('Error al unirse al grupo')
    }
    setIsLoading(false)
  }

  const handleRejectGroup = async () => {
    setIsLoading(true)
    try {
      await rejectGroup(notification.id)
      mutate(['notifications'])
      mutate(['group-notifications'])
      toast.success('Has rechazado la invitación')
    } catch (error) {
      toast.error('Error al rechazar la invitación')
    }
    setIsLoading(false)
  }

  const handleMarkAsRead = async () => {
    setIsLoading(true)
    try {
      await markAsRead(notification.id)
      mutate(['notifications'])
      toast.success('Notificación marcada como leída')
    } catch (error) {
      toast.error('Error al marcar la notificación como leída')
    }
    setIsLoading(false)
  }

  const { timeAgo } = useTimeAgo(notification.createdAt.getTime())

  return (
    <div className={cn('flex items-start gap-3 w-full', !notification.read && 'bg-zinc-100 dark:bg-zinc-800')}>
      <div className="flex h-8 w-8 items-center justify-center rounded-full dark:bg-zinc-100 dark:text-zinc-500">
        <IconUsers className="h-4 w-4" />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <div className="font-semibold">{notification.group?.name}</div>
          <div className="ml-auto text-xs text-zinc-500">{timeAgo}</div>
        </div>
        <p className="text-sm text-zinc-500">{notification.message}</p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleJoinGroup} disabled={isLoading}>
            Aceptar
          </Button>
          <Button variant="ghost" size="sm" onClick={handleRejectGroup} disabled={isLoading}>
            Rechazar
          </Button>
          <Button variant="ghost" size="sm" onClick={handleMarkAsRead} disabled={isLoading}>
            Marcar como leído
          </Button>
        </div>
      </div>
    </div>
  )
}

export const GenericNotification = ({ notification }: { notification: Notification }) => {
  const { mutate } = useSWRConfig()
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      await deleteNotification(notification.id)
      mutate(['notifications'])
      toast.success('Notificación eliminada')
    } catch (error) {
      toast.error('Error al eliminar la notificación')
    }
    setIsLoading(false)
  }

  const handleMarkAsRead = async () => {
    setIsLoading(true)
    try {
      await markAsRead(notification.id)
      mutate(['notifications'])
      toast.success('Notificación marcada como leída')
    } catch (error) {
      toast.error('Error al marcar la notificación como leída')
    }
    setIsLoading(false)
  }

  const { timeAgo } = useTimeAgo(notification.createdAt.getTime())

  return (
    <div className="flex items-start gap-3 w-full">
      <div className="flex h-8 w-8 items-center justify-center rounded-full dark:bg-zinc-100 dark:text-zinc-500">
        <IconUsers className="h-4 w-4" />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <div className="font-semibold">{notification?.title || 'Notificación'}</div>
          <div className="ml-auto text-xs text-zinc-500">{timeAgo}</div>
        </div>
        <p className="text-sm text-zinc-500">{notification.message}</p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleMarkAsRead} disabled={isLoading}>
            Marcar como leído
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDelete} disabled={isLoading}>
            Eliminar
          </Button>
        </div>
      </div>
    </div>
  )
}

export const NotificationSkeleton = () => {
  return (
    <div className="flex items-start gap-3 w-full">
      <div className="flex h-8 w-8 items-center justify-center rounded-full dark:bg-zinc-100 dark:text-zinc-500">
        <Skeleton className="h-4 w-4" />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <div className="font-semibold">
            <Skeleton className="w-20 h-6" />
          </div>
          <div className="ml-auto text-xs text-zinc-500">
            <Skeleton className="w-10 h-5" />
          </div>
        </div>
        <Skeleton className="w-full h-4" />

        <div className="flex items-center gap-2">
          <Skeleton className="w-20 h-9" />
          <Skeleton className="w-20 h-9" />
        </div>
      </div>
    </div>
  )
}
