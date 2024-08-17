import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import Link from 'next/link'
import { GroupDetails } from './group-details'
import { InviteMembers } from './invite'
import { LinksGenerated, UsersInvited } from './invitations'
import { getGroup } from '@/data/actions/groups'

export default async function GroupSettings ({ params } : { params: { groupId: string } }) {
  const groupId = params.groupId

  if (!groupId) {
    notFound()
  }

  const session = await getServerSession(authOptions)
  const group = await getGroup(groupId)

  if (!group || !group.users.find(user => user.id === session?.user?.id) || !group.users.find(user => user.userGroupRole.find(g => g.groupId === groupId)?.role === 'ADMIN')) {
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
              <BreadcrumbPage>Configuración</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex gap-6 flex-wrap">
        <GroupDetails groupId={groupId} userId={session?.user?.id as string} isOwner={isOwner} />
        <InviteMembers groupId={groupId} userId={session?.user?.id as string} />
        <UsersInvited groupId={groupId} userId={session?.user?.id as string} />
        <LinksGenerated groupId={groupId} userId={session?.user?.id as string} />
      </div>
    </>
  )
}
