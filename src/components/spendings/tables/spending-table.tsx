import { CreateSpendingSheet } from '@/components/spendings/sheets/create-spending-sheet'
import { DataTable } from '@/components/data-table/data-table'
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar'
import { SpendingIcon, SpendingTypes } from '@/components/spending-icons'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { useDataTable } from '@/hooks/use-data-table'
import { formatDate } from '@/lib/dates'
import { formatMoney } from '@/lib/money'
import { cn } from '@/lib/utils'
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
    <DataTable table={table}>
      <DataTableToolbar table={table} filterFields={filterFields} />
    </DataTable>
  )
}

export function MobileSpendingTable ({ data, groupId }: { data: SpendingTableType[], groupId: string }) {
  return (
    <section className="flex flex-col gap-3 sm:hidden">
      {data?.map((spending) => (
        <Link
          key={spending.id}
          href={`/groups/${groupId}/spendings/${spending.id}`}
          className="flex flex-col gap-3 rounded-md border p-4 transition-colors hover:bg-muted/40"
        >
          <header className="flex items-center gap-3">
            <div className={cn(buttonVariants({ variant: 'secondary', size: 'icon' }), 'shrink-0 rounded-full')}>
              <SpendingIcon type={spending.category as SpendingTypes} className="text-muted-foreground/80" />
            </div>
            <div className="min-w-0">
              <h3 className="truncate font-semibold">{spending.name}</h3>
              <p className="text-sm text-muted-foreground">{formatDate(spending.date)} · {spending.createdBy ?? 'Anónimo'}</p>
            </div>
          </header>

          <div className="flex items-center justify-between gap-2">
            <span className="font-mono font-semibold">{formatMoney(spending.amount)}</span>
            {spending.hasDebt && <Badge variant="destructive">Debés</Badge>}
            {spending.someoneOwesYou && <Badge variant="secondary">Te deben</Badge>}
          </div>
        </Link>
      ))}
    </section>
  )
}
