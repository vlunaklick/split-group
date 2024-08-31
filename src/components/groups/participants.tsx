import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { getGroup } from '@/data/apis/groups'
import Link from 'next/link'
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
      <header className="flex md:items-center gap-4 md:gap-6 flex-col md:flex-row">
        <h1 className="text-3xl font-semibold">{data.group?.name}</h1>

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/groups/${groupId}`}>Grupo</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Participantes</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="ml-auto flex gap-4">
          {!data.isOwner && (
            <LeaveGroupButton groupId={groupId} />
          )}
          {data.isOwner && data.isAdmin && (
            <InvitesSheet groupId={groupId} />
          )}
        </div>
      </header>

      <div className="flex flex-col gap-6 lg:flex-row">
        <ParticipantsList groupId={groupId} isOwner={data.isOwner} isAdmin={data.isAdmin ?? false} userId={data.userId ?? ''} />
        <AdminsList groupId={groupId} isOwner={data.isOwner} userId={data.userId ?? ''} />
      </div>
    </>
  )
}

export function ParticipantsSkeleton () {
  return (
    <>
      <header className="flex md:items-center gap-4 md:gap-6 flex-col md:flex-row">
        <Skeleton className="w-40 h-9" />

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/groups">Grupo</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Participantes</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex flex-col gap-6 lg:flex-row">
        <ParticipantsListSkeleton />
        <AdminsListSkeleton />
      </div>
    </>
  )
}
