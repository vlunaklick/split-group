import { CreateSpendingSheet } from '@/components/spendings/sheets/create-spending-sheet'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { getGroup } from '@/data/apis/groups'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SpendingsList } from './lists/spendings-list'
import { GetSpendingsSchema } from '@/lib/validations'
import { DataTableSkeleton } from '../data-table/data-table-skeleton'
import { Skeleton } from '../ui/skeleton'

export async function Spendings ({ groupId, searchParams }: { groupId: string, searchParams: GetSpendingsSchema }) {
  const data = await getGroup(groupId)

  if (!data || !data.group) {
    notFound()
  }

  return (
    <>
      <header className="flex md:items-center gap-4 flex-col md:flex-row md:justify-between">
        <div className="flex flex-row gap-4 items-center flex-wrap">
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
        <SpendingsList groupId={groupId} searchParams={searchParams} />
      </div>
    </>
  )
}

export const SpendingsPageSkeleton = () => {
  return (
    <>
      <header className="flex md:justify-between md:items-center gap-4 flex-col md:flex-row">
        <div className="flex flex-col gap-2">
          <Skeleton className="w-40 h-10" />
        </div>
      </header>

      <DataTableSkeleton
        columnCount={5}
        rowCount={10}
        searchableColumnCount={1}
        showViewOptions
        cellWidths={['auto', 'auto', 'auto', 'auto', 'auto']}
        withPagination
        shrinkZero
      />
    </>
  )
}
