import { GroupHome, GroupHomeSkeleton } from '@/components/groups/home'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

export default async function GroupId ({ params } : { params: { groupId: string } }) {
  const groupId = params.groupId

  if (!groupId) {
    notFound()
  }

  return (
    <Suspense fallback={<GroupHomeSkeleton />}>
      <GroupHome groupId={groupId} />
    </Suspense>
  )
}
