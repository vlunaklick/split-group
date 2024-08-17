import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import Link from 'next/link'
import { AdminsList, ParticipantsList } from './list'
import { LeaveGroupButton } from './button'
import { getGroup } from '@/data/actions/groups'

export default async function GroupParticipants ({ params } : { params: { groupId: string } }) {
  const groupId = params.groupId

  if (!groupId) {
    notFound()
  }

  const session = await getServerSession(authOptions)
  const group = await getGroup(groupId)

  if (!group || !group.users.find(user => user.id === session?.user?.id)) {
    notFound()
  }

  const isOwner = group.ownerId === session?.user?.id

  return (
    <>
      <header className="flex md:items-center gap-4 md:gap-6 flex-col md:flex-row">
        <h1 className="text-3xl font-semibold">{group.name}</h1>

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
        {!isOwner && (
          <LeaveGroupButton groupId={groupId} userId={session?.user?.id as string} />
        )}
      </header>

      <div className="flex flex-col gap-6 lg:flex-row">
        <ParticipantsList groupId={groupId} userId={session?.user?.id as string} />
        <AdminsList groupId={groupId} userId={session?.user?.id as string} />
      </div>
    </>
  )
}
