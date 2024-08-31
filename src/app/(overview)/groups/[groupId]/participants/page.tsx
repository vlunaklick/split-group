import { Participants, ParticipantsSkeleton } from '@/components/groups/participants'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

export default async function BreadcrumbPage ({ params } : { params: { groupId: string } }) {
  const groupId = params.groupId

  if (!groupId) {
    notFound()
  }

  return (
    <Suspense fallback={<ParticipantsSkeleton />}>
      <Participants groupId={groupId} />
    </Suspense>
  )
}
