import { MarkAllAsRead } from '@/components/user/notifications/notifications-buttons'
import { ListNotifications } from '@/components/user/notifications/notifications-lists'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Avisos',
  description: 'Invitaciones y actividad de tus grupos'
}

export default async function Notifications () {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="grid gap-1">
          <h1 className="text-display-sm">Avisos</h1>
          <p className="text-sm text-muted-foreground">
            Invitaciones y novedades de tus grupos.
          </p>
        </div>
        <MarkAllAsRead />
      </header>

      <ListNotifications />
    </div>
  )
}
