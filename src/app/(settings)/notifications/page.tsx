import { authOptions } from '@/lib/auth'
import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { ListNotifications } from './list'
import { MarkAllAsRead } from './buttons'

export const metadata: Metadata = {
  title: 'Notifications',
  description: 'Notifications'
}

export default async function Notifications () {
  const session = await getServerSession(authOptions)

  return (
    <div className="mx-auto w-full max-w-2xl flex flex-col gap-4">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Notificaciones</h1>
        <MarkAllAsRead userId={session?.user?.id as string} />
      </header>
      <ListNotifications userId={session?.user?.id as string} />
    </div>
  )
}
