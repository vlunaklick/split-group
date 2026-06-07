'use client'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetGroupNotifications, useGetNotifications } from '@/data/notifications'
import { cn } from '@/lib/utils'
import { useTimeAgo } from '@/utils/time'
import { displayToast } from '@/utils/toast-display'
import { Notification } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useSWRConfig } from 'swr'
import { deleteNotification, joinGroup, markAsRead, rejectGroup } from '../../../app/(user)/notifications/actions'
import { NotificationWithGroups } from '../../../app/(user)/notifications/types'

export const ListNotifications = () => {
  const { data: notifications, isLoading: isLoadingNotifications } = useGetNotifications()
  const { data: groupNotifications, isLoading: isLoadingGroupNotifications } = useGetGroupNotifications()

  return (
    <div className="grid gap-10">
      <NotificationSection
        label="Invitaciones"
        isLoading={isLoadingGroupNotifications}
        isEmpty={!groupNotifications?.length}
        emptyMessage="Sin invitaciones pendientes"
      >
        {groupNotifications?.map((notification: NotificationWithGroups) => (
          <GroupNotification key={notification.id} notification={notification} />
        ))}
      </NotificationSection>

      <NotificationSection
        label="Actividad"
        isLoading={isLoadingNotifications}
        isEmpty={!notifications?.length}
        emptyMessage="Sin avisos nuevos"
      >
        {notifications?.map((notification: Notification) => (
          <GenericNotification key={notification.id} notification={notification} />
        ))}
      </NotificationSection>
    </div>
  )
}

function NotificationSection ({
  label,
  isLoading,
  isEmpty,
  emptyMessage,
  children
}: {
  label: string
  isLoading: boolean
  isEmpty: boolean
  emptyMessage: string
  children: React.ReactNode
}) {
  return (
    <section className="grid gap-3">
      <h2 className="section-label">{label}</h2>

      {isLoading && (
        <ul className="divide-y divide-border rounded-lg border border-border">
          <NotificationSkeleton />
          <NotificationSkeleton />
        </ul>
      )}

      {!isLoading && isEmpty && (
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      )}

      {!isLoading && !isEmpty && (
        <ul className="divide-y divide-border rounded-lg border border-border">
          {children}
        </ul>
      )}
    </section>
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
    <li className={cn('px-4 py-4', !notification.read && 'bg-accent/30')}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <p className="text-sm font-medium">{notification.group?.name}</p>
          <p className="text-sm text-muted-foreground">{notification.message}</p>
        </div>
        <span className="shrink-0 text-xs text-muted-foreground">{timeAgo}</span>
      </div>
      <div className="mt-3 flex gap-2">
        <Button size="sm" onClick={handleJoinGroup} disabled={isLoading}>
          {isLoading ? 'Uniéndote…' : 'Aceptar'}
        </Button>
        <Button variant="ghost" size="sm" onClick={handleRejectGroup} disabled={isLoading}>
          Rechazar
        </Button>
      </div>
    </li>
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
    <li className={cn('px-4 py-4', !notification.read && 'bg-accent/30')}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <p className="text-sm font-medium">{notification.title || 'Aviso'}</p>
          <p className="text-sm text-muted-foreground">{notification.message}</p>
        </div>
        <span className="shrink-0 text-xs text-muted-foreground">{timeAgo}</span>
      </div>
      <div className="mt-3 flex gap-2">
        {!notification.read && (
          <Button variant="ghost" size="sm" onClick={handleMarkAsRead} disabled={isLoading}>
            Leído
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={handleDelete} disabled={isLoading}>
          Eliminar
        </Button>
      </div>
    </li>
  )
}

export const NotificationSkeleton = () => {
  return (
    <li className="flex gap-3 px-4 py-4">
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-full max-w-sm" />
        <Skeleton className="h-8 w-36" />
      </div>
    </li>
  )
}
