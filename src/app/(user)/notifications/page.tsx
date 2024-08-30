import { MarkAllAsRead } from '@/components/user/notifications/notifications-buttons'
import { ListNotifications } from '@/components/user/notifications/notifications-lists'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Notifications',
  description: 'Notifications'
}

export default async function Notifications () {
  return (
    <div className="mx-auto w-full max-w-2xl flex flex-col gap-4">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Notificaciones</h1>
        <MarkAllAsRead />
      </header>

      <ListNotifications />
    </div>
  )
}
