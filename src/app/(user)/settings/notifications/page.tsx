import { LimitSetting } from '@/components/user/settings/limits-setting'
import { NotificationsWantedSettings } from '@/components/user/settings/notifications-wanted-setting'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Notifications',
  description: 'Dashboard'
}

export default async function Notifications () {
  return (
    <>
      <NotificationsWantedSettings />
      <LimitSetting />
    </>
  )
}
