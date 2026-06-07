'use client'

import { type ColumnDef } from '@tanstack/react-table'
import { formatDate } from '@/lib/dates'
import { SpendingTableType } from '@/lib/exports'
import { formatMoney } from '@/lib/money'
import Link from 'next/link'

export function getColumns (): ColumnDef<SpendingTableType>[] {
  return [
    {
      accessorKey: 'name',
      header: 'Gasto',
      cell: ({ cell }) => {
        const spending = cell.row.original
        const url = `/groups/${spending.groupId}/spendings/${spending.id}`

        return (
          <Link href={url} className="group block min-w-0 py-0.5">
            <span className="font-medium group-hover:text-primary transition-colors">{spending.name}</span>
            {spending.createdBy && (
              <span className="mt-0.5 block text-xs text-muted-foreground">{spending.createdBy}</span>
            )}
          </Link>
        )
      }
    },
    {
      accessorKey: 'category',
      header: 'Categoría',
      cell: ({ cell }) => (
        <span className="text-sm text-muted-foreground">{cell.row.original.category}</span>
      )
    },
    {
      accessorKey: 'date',
      header: 'Fecha',
      cell: ({ cell }) => (
        <span className="text-sm">{formatDate(cell.row.original.date)}</span>
      )
    },
    {
      accessorKey: 'amount',
      header: () => <span className="text-right block w-full">Monto</span>,
      cell: ({ cell }) => {
        const spending = cell.row.original

        return (
          <div className="text-right">
            <span className="font-mono text-sm">{formatMoney(spending.amount)}</span>
            {spending.hasDebt && (
              <span className="mt-0.5 block text-xs text-destructive">Debés</span>
            )}
            {spending.someoneOwesYou && (
              <span className="mt-0.5 block text-xs text-success">Te deben</span>
            )}
          </div>
        )
      }
    }
  ]
}
