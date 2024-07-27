import { getGroup } from '@/lib/data'
import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import Link from 'next/link'
import { CreateSpending } from './create'

export default async function GroupId ({ params } : { params: { groupId: string } }) {
  const groupId = params.groupId

  if (!groupId) {
    notFound()
  }

  const session = await getServerSession(authOptions)
  const group = await getGroup(groupId)

  if (!group || !group.users.find(user => user.id === session?.user?.id)) {
    notFound()
  }

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
              <BreadcrumbLink asChild>
                <Link href={`/groups/${groupId}/spendings`}>Gastos</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Nuevo gasto</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="flex gap-6 flex-wrap">
        <CreateSpending groupId={groupId} userId={session?.user?.id as string} />
      </div>
    </>
  )
}
