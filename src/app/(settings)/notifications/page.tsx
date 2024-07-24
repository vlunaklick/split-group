import { authOptions } from '@/lib/auth'
import { Metadata } from 'next'
import { getServerSession } from 'next-auth'

export const metadata: Metadata = {
  title: 'Notifications',
  description: 'Notifications'
}

export default async function Notifications () {
  const session = await getServerSession(authOptions)

  return (
    <>
    </>
  )
}
