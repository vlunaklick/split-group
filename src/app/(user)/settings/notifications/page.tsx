import { LimitSetting } from '@/components/user/settings/limits-setting'
import { NotificationsWantedSettings } from '@/components/user/settings/notifications-wanted-setting'
import { WeeklyDigestSetting } from '@/components/user/settings/weekly-digest-setting'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Alertas',
  description: 'Configurá qué avisos recibir y tus límites de gasto'
}

export default async function NotificationsSettings () {
  return (
    <>
      <NotificationsWantedSettings />
      <WeeklyDigestSetting />
      <LimitSetting />
    </>
  )
}
