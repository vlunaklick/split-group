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

  // Acá podemos definir los campos por los que se puede filtrar la tabla (Nos referimos a buscar)
  const filterFields: DataTableFilterField<SpendingTableType>[] = [
    {
      label: 'Nombre',
      value: 'name',
      placeholder: 'Buscar por nombre'
    }
  ]

  const { table } = useDataTable({
    data: data.data || [],
    columns,
    pageCount: data.totalPages,
    /* optional props */
    filterFields,
    initialState: {
      columnPinning: { right: ['actions'] }
    },
    getRowId: (originalRow, index) => `${originalRow.id}-${index}`
  })

  return (
    <DataTable
      table={table}
    >
      <DataTableToolbar table={table} filterFields={filterFields} />
    </DataTable>
  )
}

export function MobileSpendingTable ({ data, groupId }: { data: SpendingTableType[], groupId: string }) {
  return (
    <section className='sm:hidden flex flex-col gap-4'>
      {data?.map((spending: SpendingTableType) => (
        <article key={spending.id} className='flex flex-col justify-center gap-4 p-4 border rounded-md'>
          <header className='flex items-center gap-4'>
            <div className={cn(buttonVariants({ variant: 'secondary', size: 'icon' }), 'rounded-full')}>
              <SpendingIcon type={spending.category as SpendingTypes} className='text-muted-foreground/80' />
            </div>

            <div>
              <h3 className='font-bold'>{spending.name}</h3>
              <div className='text-sm text-muted-foreground/80'>{formatDate(spending.date)}</div>
            </div>
          </header>

          <div className='flex flex-col gap-2'>
            <p className='text-sm text-muted-foreground/80'>
              Creada por:{' '}
              <span className='font-bold'>
                {spending.createdBy || 'Anónimo'}
              </span>
            </p>

            {spending.description && (
              <p className='text-sm text-muted-foreground/80'>Descripción: {spending.description}</p>
            )}

            <div className='flex items-center gap-4 justify-between'>
              <div className='font-bold'>{formatMoney(spending.amount)}</div>
              {spending.hasDebt && <Badge variant='destructive'>Debes</Badge>}
              {spending.someoneOwesYou && <Badge variant="secondary">Te deben</Badge>}
              {!spending.someoneOwesYou && !spending.hasDebt && <Badge variant="default">-</Badge>}
            </div>
          </div>

          <footer>
            <Link href={`/groups/${groupId}/spendings/${spending.id}`} className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}>
              Ver
            </Link>
          </footer>
        </article>
      ))}
    </section>
  )
}
