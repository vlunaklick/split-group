import { Metadata } from 'next'
import { DeleteSetting } from './delete'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { UsernameSettings } from './username'
import { NameSettings } from './name'

export const metadata: Metadata = {
  title: 'General',
  description: 'Dashboard'
}

export default async function General () {
  const session = await getServerSession(authOptions)

  return (
    <>
      <NameSettings userId={session?.user?.id as string} />
      <UsernameSettings userId={session?.user?.id as string} />
      <DeleteSetting userId={session?.user?.id as string} />
    </>
  )
}
