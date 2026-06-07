import { DeleteSetting } from '@/components/user/settings/delete-user-setting'
import { NameSettings } from '@/components/user/settings/name-setting'
import { UsernameSettings } from '@/components/user/settings/username-setting'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Datos de cuenta',
  description: 'Nombre, usuario y eliminación de cuenta en Split Group'
}

export default async function AccountSettings () {
  return (
    <>
      <NameSettings />
      <UsernameSettings />
      <DeleteSetting />
    </>
  )
}
