import { getGroup } from '@/data/apis/groups'
import { notFound } from 'next/navigation'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../ui/breadcrumb'
import Link from 'next/link'
import { GroupDetails, GroupDetailsSkeleton } from './group-details'
import { Skeleton } from '../ui/skeleton'

export async function GroupSettings ({ groupId }: { groupId: string }) {
  const data = await getGroup(groupId)

  if (!data.group || !data.isAdmin || !data.isOwner) {
    notFound()
  }

  return (
    <>
      <header className="flex md:items-center gap-4 md:gap-6 flex-col md:flex-row">
        <h1 className="text-3xl font-semibold">{data.group.name}</h1>

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
        <GroupDetails groupId={groupId} />
      </div>
    </>
  )
}

export const GroupSettingsSkeleton = () => {
  return (
    <>
      <header className="flex md:items-center gap-4 md:gap-6 flex-col md:flex-row">
        <Skeleton className="w-1/4 h-8" />

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Skeleton className="w-20 h-6" />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Skeleton className="w-20 h-6" />
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex gap-6 flex-wrap">
        <GroupDetailsSkeleton />
      </div>
    </>
  )
}
