import { AlertSettings } from '@/components/user/settings/alert-setting'
import { CurrencySetting } from '@/components/user/settings/currency-setting'
import { ThemeSetting } from '@/components/user/settings/theme-setting'
import { Metadata } from 'next'

// TODO: Change the title and description
export const metadata: Metadata = {
  title: 'Appearance',
  description: 'Dashboard'
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
