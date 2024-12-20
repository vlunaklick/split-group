'use client'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetGroupNotifications, useGetNotifications } from '@/data/notifications'
import { cn } from '@/lib/utils'
import { useTimeAgo } from '@/utils/time'
import { displayToast } from '@/utils/toast-display'
import { Notification } from '@prisma/client'
import { IconUsers } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
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
      displayToast('Te has unido al grupo!', 'success')
      setTimeout(() => {
        router.push(`/groups/${notification?.group?.id}`)
      })
    } catch (error) {
      displayToast('Error al unirse al grupo', 'error')
    }
    setIsLoading(false)
  }

  const handleRejectGroup = async () => {
    setIsLoading(true)
    try {
      await rejectGroup(notification.id)
      mutate(['notifications'])
      mutate(['group-notifications'])
      displayToast('Has rechazado la invitación', 'success')
    } catch (error) {
      displayToast('Error al rechazar la invitación', 'error')
    }
    setIsLoading(false)
  }

  const handleMarkAsRead = async () => {
    setIsLoading(true)
    try {
      await markAsRead(notification.id)
      mutate(['notifications'])
      displayToast('Notificación marcada como leída', 'success')
    } catch (error) {
      displayToast('Error al marcar la notificación como leída', 'error')
    }
    setIsLoading(false)
  }

  const createdAt = new Date(notification.createdAt ?? new Date())
  const { timeAgo } = useTimeAgo(createdAt.getTime())

  return (
    <div className={cn('flex items-start gap-3 w-full relative')}>
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
        <IconUsers className="h-4 w-4" />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <div className="font-semibold">{notification.group?.name}</div>
          <div className="ml-auto text-xs text-zinc-500">{timeAgo}</div>
        </div>
        <p className="text-sm text-zinc-500">{notification.message}</p>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={handleJoinGroup} disabled={isLoading}>
            Aceptar
          </Button>
          <Button variant="ghost" size="sm" onClick={handleRejectGroup} disabled={isLoading}>
            Rechazar
          </Button>
          {!notification.read
            ? (
            <Button variant="ghost" size="sm" onClick={handleMarkAsRead} disabled={isLoading}>
              Marcar como leído
            </Button>
              )
            : null}
        </div>
      </div>

      {!notification.read && (
        <div className="absolute top-0 left-5">
          <div className="h-3 w-3 bg-green-500 rounded-full">
            <div className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-700 opacity-75"></div>
          </div>
        </div>
      )}
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
      displayToast('Notificación eliminada', 'success')
    } catch (error) {
      displayToast('Error al eliminar la notificación', 'error')
    }
    setIsLoading(false)
  }

  const handleMarkAsRead = async () => {
    setIsLoading(true)
    try {
      await markAsRead(notification.id)
      mutate(['notifications'])
      displayToast('Notificación marcada como leída', 'success')
    } catch (error) {
      displayToast('Error al marcar la notificación como leída', 'error')
    }
    setIsLoading(false)
  }

  const createdAt = new Date(notification.createdAt ?? new Date())
  const { timeAgo } = useTimeAgo(createdAt.getTime())

  return (
    <div className="flex items-start gap-3 w-full relative">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
        <IconUsers className="h-4 w-4" />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <div className="font-semibold">{notification?.title || 'Notificación'}</div>
          <div className="ml-auto text-xs text-zinc-500">{timeAgo}</div>
        </div>
        <p className="text-sm text-zinc-500">{notification.message}</p>
        <div className="flex items-center gap-2 flex-wrap">
          {!notification.read && (
            <Button variant="outline" size="sm" onClick={handleMarkAsRead} disabled={isLoading}>
              Marcar como leído
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={handleDelete} disabled={isLoading}>
            Eliminar
          </Button>
        </div>
      </div>

      {!notification.read && (
        <div className="absolute top-0 left-5">
          <div className="h-3 w-3 bg-green-500 rounded-full">
            <div className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-700 opacity-75"></div>
          </div>
        </div>
      )}
    </div>
  )
}

export const NotificationSkeleton = () => {
  return (
    <div className="flex items-start gap-3 w-full">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
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
