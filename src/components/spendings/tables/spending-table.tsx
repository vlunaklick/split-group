import { DataTable } from '@/components/data-table/data-table'
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar'
import { useDataTable } from '@/hooks/use-data-table'
import { formatDate } from '@/lib/dates'
import { formatMoney } from '@/lib/money'
import { DataTableFilterField } from '@/types'
import Link from 'next/link'
import { useMemo } from 'react'
import { getColumns } from './spending-table-columns'

type SpendingTableType = {
  id: string
  name: string
  description: string | null
  date: Date
  amount: number
  category: string
  createdBy: string | null
  hasDebt: boolean
  someoneOwesYou: boolean
  groupId: string
}

export function SpendingTable ({ data, groupId }: { data: any, groupId: string }) {
  const columns = useMemo(() => getColumns(), [])
  const count = data?.total ?? data?.data?.length ?? 0

  const filterFields: DataTableFilterField<SpendingTableType>[] = [
    {
      label: 'Nombre',
      value: 'name',
      placeholder: 'Buscar gasto…'
    }
  ]

  const { table } = useDataTable({
    data: data.data || [],
    columns,
    pageCount: data.totalPages,
    filterFields,
    getRowId: (originalRow, index) => `${originalRow.id}-${index}`
  })

  return (
    <section className="surface-panel overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <p className="text-sm text-muted-foreground">
          {count} {count === 1 ? 'gasto' : 'gastos'} en el grupo
        </p>
      </div>
      <div className="p-4">
        <DataTable table={table} className="space-y-4 [&>div:nth-child(2)]:border-0">
          <DataTableToolbar table={table} filterFields={filterFields} showViewOptions={false} />
        </DataTable>
      </div>
    </section>
  )
}

export function MobileSpendingTable ({ data, groupId }: { data: SpendingTableType[], groupId: string }) {
  return (
    <ul className="surface-panel divide-y divide-border sm:hidden">
      {data?.map((spending) => (
        <li key={spending.id}>
          <Link
            href={`/groups/${groupId}/spendings/${spending.id}`}
            className="list-row"
          >
            <div className="min-w-0 flex-1 grid gap-0.5">
              <p className="truncate text-sm font-medium">{spending.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {spending.category}
                {spending.createdBy && ` · ${spending.createdBy}`}
              </p>
              <p className="text-xs text-muted-foreground">{formatDate(spending.date)}</p>
            </div>
            <div className="shrink-0 text-right">
              <span className="font-mono text-sm">{formatMoney(spending.amount)}</span>
              {spending.hasDebt && (
                <p className="text-xs text-destructive">Debés</p>
              )}
              {spending.someoneOwesYou && (
                <p className="text-xs text-success">Te deben</p>
              )}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}
