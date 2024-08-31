import { CreateSpendingSheet } from '@/components/spendings/sheets/create-spending-sheet'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { getGroup } from '@/data/actions/groups'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SpendingsList } from './lists/spendings-list'

export async function Spendings ({ groupId }: { groupId: string }) {
  const data = await getGroup(groupId)

  if (!data || !data.group) {
    notFound()
  }

  return (
    <>
      <header className="flex md:items-center gap-4 flex-col md:flex-row md:justify-between">
        <div className="flex flex-row gap-4 items-center">
          <h1 className="text-3xl font-semibold">
            {data.group.name}
          </h1>

          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={`/groups/${groupId}`}>Grupo</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Gastos</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <CreateSpendingSheet groupId={groupId} />
      </header>

      <div className="grid gap-4">
        <SpendingsList groupId={groupId} />
      </div>
    </>
  )
}
