import { GroupPageHeader } from '@/components/groups/group-page-header'
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
      <GroupPageHeader
        groupId={groupId}
        groupName={data.group?.name ?? ''}
        title="Participantes"
        description="Miembros del grupo y quién puede administrarlo."
        actions={
          <>
            {!data.isOwner && (
              <LeaveGroupButton groupId={groupId} />
            )}
            {data.isOwner && data.isAdmin && (
              <InvitesSheet groupId={groupId} />
            )}
          </>
        }
      />

      <div className="w-full max-w-3xl">
        <div className="surface-panel overflow-hidden">
          <ParticipantsList
            embedded
            groupId={groupId}
            isOwner={data.isOwner}
            isAdmin={data.isAdmin ?? false}
            userId={data.userId ?? ''}
          />
          <AdminsList embedded groupId={groupId} isOwner={data.isOwner} userId={data.userId ?? ''} />
        </div>
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

      <div className="w-full max-w-3xl">
        <div className="surface-panel overflow-hidden">
          <ParticipantsListSkeleton embedded />
          <AdminsListSkeleton embedded />
        </div>
      </div>
    </>
  )
}
