import { GroupSettings, GroupSettingsSkeleton } from '@/components/groups/settings'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

export default async function Page ({ params } : { params: { groupId: string } }) {
  const groupId = params.groupId

  if (!groupId) {
    notFound()
  }

  return (
    <Suspense fallback={<GroupSettingsSkeleton />}>
      <GroupSettings groupId={groupId} />
    </Suspense>
  )
}
