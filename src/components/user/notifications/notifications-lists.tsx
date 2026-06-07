'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetGroupNotifications, useGetNotifications } from '@/data/notifications'
import { cn } from '@/lib/utils'
import { useTimeAgo } from '@/utils/time'
import { displayToast } from '@/utils/toast-display'
import { Notification } from '@prisma/client'
import { IconBell, IconUsers } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useSWRConfig } from 'swr'
import { deleteNotification, joinGroup, markAsRead, rejectGroup } from '../../../app/(user)/notifications/actions'
import { NotificationWithGroups } from '../../../app/(user)/notifications/types'

export const ListNotifications = () => {
  const { data: notifications, isLoading: isLoadingNotifications } = useGetNotifications()
  const { data: groupNotifications, isLoading: isLoadingGroupNotifications } = useGetGroupNotifications()

  return (
    <div className="grid gap-8">
      <section className="grid gap-3">
        <h2 className="text-sm font-medium text-muted-foreground">Invitaciones</h2>

        {isLoadingGroupNotifications && (
          <div className="grid gap-3">
            <NotificationSkeleton />
            <NotificationSkeleton />
          </div>
        )}

        {!isLoadingGroupNotifications && groupNotifications?.length === 0 && (
          <p className="text-sm text-muted-foreground">No tenés invitaciones pendientes</p>
        )}

        {!isLoadingGroupNotifications && groupNotifications?.map((notification: NotificationWithGroups) => (
          <GroupNotification key={notification.id} notification={notification} />
        ))}
      </section>

      <section className="grid gap-3">
        <h2 className="text-sm font-medium text-muted-foreground">Actividad</h2>

        {isLoadingNotifications && (
          <div className="grid gap-3">
            <NotificationSkeleton />
            <NotificationSkeleton />
          </div>
        )}

        {!isLoadingNotifications && notifications?.length === 0 && (
          <p className="text-sm text-muted-foreground">No tenés avisos nuevos</p>
        )}

        {!isLoadingNotifications && notifications?.map((notification: Notification) => (
          <GenericNotification key={notification.id} notification={notification} />
        ))}
      </section>
    </div>
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
      displayToast('Te uniste al grupo', 'success')
      router.push(`/groups/${notification?.group?.id}`)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo unir al grupo'
      displayToast(message, 'error')
      setIsLoading(false)
    }
  }

  const handleRejectGroup = async () => {
    setIsLoading(true)
    try {
      await rejectGroup(notification.id)
      mutate(['notifications'])
      mutate(['group-notifications'])
      displayToast('Invitación rechazada', 'success')
    } catch (error) {
      displayToast('No se pudo rechazar la invitación', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const createdAt = new Date(notification.createdAt ?? new Date())
  const { timeAgo } = useTimeAgo(createdAt.getTime())

  return (
    <Card className={cn(!notification.read && 'border-primary/30 bg-primary/5')}>
      <CardContent className="flex gap-3 p-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
          <IconUsers className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold">{notification.group?.name}</p>
              <p className="text-sm text-muted-foreground">{notification.message}</p>
            </div>
            <span className="shrink-0 text-xs text-muted-foreground">{timeAgo}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={handleJoinGroup} disabled={isLoading}>
              {isLoading ? 'Uniéndote…' : 'Aceptar'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleRejectGroup} disabled={isLoading}>
              Rechazar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
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
      displayToast('Aviso eliminado', 'success')
    } catch (error) {
      displayToast('No se pudo eliminar', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkAsRead = async () => {
    setIsLoading(true)
    try {
      await markAsRead(notification.id)
      mutate(['notifications'])
    } catch (error) {
      displayToast('No se pudo marcar como leído', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const createdAt = new Date(notification.createdAt ?? new Date())
  const { timeAgo } = useTimeAgo(createdAt.getTime())

  return (
    <Card className={cn(!notification.read && 'border-primary/30 bg-primary/5')}>
      <CardContent className="flex gap-3 p-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
          <IconBell className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold">{notification.title || 'Aviso'}</p>
              <p className="text-sm text-muted-foreground">{notification.message}</p>
            </div>
            <span className="shrink-0 text-xs text-muted-foreground">{timeAgo}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {!notification.read && (
              <Button variant="outline" size="sm" onClick={handleMarkAsRead} disabled={isLoading}>
                Marcar leído
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={handleDelete} disabled={isLoading}>
              Eliminar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export const NotificationSkeleton = () => {
  return (
    <Card>
      <CardContent className="flex gap-3 p-4">
        <Skeleton className="h-9 w-9 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-8 w-40" />
        </div>
      </CardContent>
    </Card>
  )
}
