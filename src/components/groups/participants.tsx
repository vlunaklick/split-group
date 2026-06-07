import { GroupNav } from '@/components/groups/group-nav'
import { getGroup } from '@/data/apis/groups'
import { notFound } from 'next/navigation'
import { ParticipantsList, ParticipantsListSkeleton } from './lists/participants-list'
import { LeaveGroupButton } from './leave-group-button'
import { Skeleton } from '../ui/skeleton'
import { InvitesSheet } from './sheets/invites-sheet'
import { AdminsList, AdminsListSkeleton } from './lists/admins-list'

export async function Participants ({ groupId }: { groupId: string }) {
  const data = await getGroup(groupId)

  if (!data) {
    notFound()
  }

  return (
    <>
      <header className="flex flex-col gap-4">
        <div className="flex md:items-center gap-4 flex-col md:flex-row md:justify-between">
          <h1 className="text-display-sm">{data.group?.name}</h1>
          <div className="flex gap-2 md:ml-auto">
            {!data.isOwner && (
              <LeaveGroupButton groupId={groupId} />
            )}
            {data.isOwner && data.isAdmin && (
              <InvitesSheet groupId={groupId} />
            )}
          </div>
        </div>
        <GroupNav groupId={groupId} />
      </header>

      <div className="flex flex-col gap-6 lg:flex-row">
        <ParticipantsList groupId={groupId} isOwner={data.isOwner} isAdmin={data.isAdmin ?? false} userId={data.userId ?? ''} />
        <AdminsList groupId={groupId} isOwner={data.isOwner} userId={data.userId ?? ''} />
      </div>
    </>
  )
}

export const ParticipantsSkeleton = () => {
  return (
    <>
      <header className="flex flex-col gap-4">
        <Skeleton className="w-40 h-10" />
        <Skeleton className="w-full h-10" />
      </header>

      <div className="flex flex-col gap-6 lg:flex-row">
        <ParticipantsListSkeleton />
        <AdminsListSkeleton />
      </div>
    </>
  )
}
