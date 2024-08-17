import { Metadata } from 'next'
import { ThemeSetting } from './theme-setting'
import { CurrencySetting } from './currency-setting'
import { AlertSettings } from './alert-setting'

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
