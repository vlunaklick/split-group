import { CreateSpendingSheet } from '@/components/spendings/sheets/create-spending-sheet'
import { RecurringSpendingsPanel } from '@/components/spendings/recurring-spendings-panel'
import { GroupPageHeader } from '@/components/groups/group-page-header'
import { getGroup } from '@/data/apis/groups'
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
      <GroupPageHeader
        groupId={groupId}
        groupName={data.group.name}
        title="Gastos"
        description="Historial completo del grupo. Tocá un gasto para ver el detalle."
        actions={<CreateSpendingSheet groupId={groupId} variant="default" />}
      />

      <div className="grid gap-4">
        <RecurringSpendingsPanel groupId={groupId} />
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
        columnCount={4}
        rowCount={8}
        searchableColumnCount={1}
        showViewOptions={false}
        cellWidths={['auto', 'auto', 'auto']}
        withPagination
        shrinkZero
      />
    </>
  )
}
