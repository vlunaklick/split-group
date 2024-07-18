import { Metadata } from 'next'
import { ThemeSetting } from './theme'
import { CurrencySetting } from './currency'
import { AlertSettings } from './alert'

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
