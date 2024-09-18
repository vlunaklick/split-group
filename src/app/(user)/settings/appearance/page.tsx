import { AlertSettings } from '@/components/user/settings/alert-setting'
import { CurrencySetting } from '@/components/user/settings/currency-setting'
import { ThemeSetting } from '@/components/user/settings/theme-setting'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Appearance',
  description: 'Change the appearance of the app'
}

export default async function Appearance () {
  return (
    <>
      <CurrencySetting />
      <ThemeSetting />
      <AlertSettings />
    </>
  )
}
