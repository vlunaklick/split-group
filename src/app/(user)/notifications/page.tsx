import { MarkAllAsRead } from '@/components/user/notifications/notifications-buttons'
import { ListNotifications } from '@/components/user/notifications/notifications-lists'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Avisos',
  description: 'Invitaciones y actividad de tus grupos'
}

export default async function Notifications () {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <h1 className="text-display-sm">Avisos</h1>
        <MarkAllAsRead />
      </header>

      <ListNotifications />
    </div>
  )
}
