import { Profile, ProfileSkeleton } from '@/components/user/profile/profile'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

// TODO: Ver de hacer esto dinámico
export const metadata: Metadata = {
  title: 'Profiles',
  description: 'Perfil de usuario'
}

export default async function Page ({ params } : { params: { username: string } }) {
  const username = params.username

  if (!username) {
    notFound()
  }

  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <Profile username={username} />
    </Suspense>
  )
}
