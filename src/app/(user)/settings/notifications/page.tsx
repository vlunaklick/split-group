import { LimitSetting } from '@/components/user/settings/limits-setting'
import { NotificationsWantedSettings } from '@/components/user/settings/notifications-wanted-setting'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Notificaciones',
  description: 'Configura tus preferencias de notificaciones'
}

export default async function Notifications () {
  return (
    <>
      <NotificationsWantedSettings />
      <LimitSetting />
    </>
  )
}
