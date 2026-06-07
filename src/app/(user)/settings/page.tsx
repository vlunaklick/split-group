import { DeleteSetting } from '@/components/user/settings/delete-user-setting'
import { NameSettings } from '@/components/user/settings/name-setting'
import { UsernameSettings } from '@/components/user/settings/username-setting'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ajustes',
  description: 'Configura tu cuenta en Split Group'
}

export default async function General () {
  return (
    <>
      <NameSettings />
      <UsernameSettings />
      <DeleteSetting />
    </>
  )
}
