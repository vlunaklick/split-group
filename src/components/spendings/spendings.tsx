import { CreateSpendingSheet } from '@/components/spendings/sheets/create-spending-sheet'
import { GroupNav } from '@/components/groups/group-nav'
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
      <header className="flex flex-col gap-4">
        <div className="flex md:items-center gap-4 flex-col md:flex-row md:justify-between">
          <h1 className="text-display-sm">
            {data.group.name}
          </h1>
          <CreateSpendingSheet groupId={groupId} variant="default" />
        </div>
        <GroupNav groupId={groupId} />
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
      <header className="flex flex-col gap-4">
        <Skeleton className="w-40 h-10" />
        <Skeleton className="w-full h-10" />
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
