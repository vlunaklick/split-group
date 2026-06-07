import { LimitSetting } from '@/components/user/settings/limits-setting'
import { NotificationsWantedSettings } from '@/components/user/settings/notifications-wanted-setting'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Preferencias de avisos',
  description: 'Configura qué notificaciones recibir'
}

export default async function Notifications () {
  return (
    <>
      <NotificationsWantedSettings />
      <LimitSetting />
    </>
  )
}
