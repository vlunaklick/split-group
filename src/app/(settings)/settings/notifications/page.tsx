import { Metadata } from 'next'
import { LimitSetting } from './alerts'
import { NotificationsWantedSettings } from './notifications-wanted'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'

export const metadata: Metadata = {
  title: 'Notifications',
  description: 'Dashboard'
}

export default async function Notifications () {
  const session = await getServerSession(authOptions)

  return (
    <>
      <NotificationsWantedSettings userId={session?.user?.id as string} />
      <LimitSetting userId={session?.user?.id as string} />
    </>
  )
}
