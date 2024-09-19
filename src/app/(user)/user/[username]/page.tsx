import { Profile, ProfileSkeleton } from '@/components/user/profile/profile'
import { getUserByUsername } from '@/data/apis/users'
import { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

export async function generateMetadata (
  { params }: { params: { username: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const username = params.username

  await getUserByUsername({ username })

  return {
    title: `Perfil de ${username}`,
    description: `Perfil de usuario ${username}`
  }
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
