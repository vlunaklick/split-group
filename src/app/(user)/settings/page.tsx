import { AccountDashboard } from '@/components/user/settings/account-dashboard'
import { getAccountOverview } from '@/data/apis/settings'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Mi cuenta',
  description: 'Panel personal para gestionar límites, avisos y preferencias'
}

export default async function SettingsHub () {
  const overview = await getAccountOverview()

  if (!overview) {
    redirect('/login')
  }

  return <AccountDashboard overview={overview} />
}
