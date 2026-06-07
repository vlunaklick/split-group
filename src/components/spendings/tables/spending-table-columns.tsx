'use client'

import { type ColumnDef } from '@tanstack/react-table'

import { SpendingIcon, SpendingTypes } from '@/components/spending-icons'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/dates'
import { SpendingTableType } from '@/lib/exports'
import { formatMoney } from '@/lib/money'
import Link from 'next/link'

export function getColumns (): ColumnDef<SpendingTableType>[] {
  return [
    {
      accessorKey: 'name',
      header: () => <p>Nombre</p>,
      cell: ({ cell }) => {
        const spending = cell.row.original
        const url = `/groups/${spending.groupId}/spendings/${spending.id}`

        return (
          <Link href={url} className="font-medium hover:underline">
            {spending.name}
          </Link>
        )
      }
    },
    {
      accessorKey: 'category',
      header: () => <p>Categoría</p>,
      cell: ({ cell }) => {
        const spending = cell.row.original

        return (
          <div className="flex items-center gap-3">
            <SpendingIcon type={spending.category as SpendingTypes} className="text-muted-foreground/80" />
            {spending.category}
          </div>
        )
      }
    },
    {
      accessorKey: 'date',
      header: () => <p>Fecha</p>,
      cell: ({ cell }) => formatDate(cell.row.original.date)
    },
    {
      accessorKey: 'hasDebt',
      header: () => <p>Estado</p>,
      cell: ({ cell }) => {
        const spending = cell.row.original

        if (spending.hasDebt) return <Badge variant="destructive" className="w-max">Debés</Badge>
        if (spending.someoneOwesYou) return <Badge variant="secondary" className="w-max">Te deben</Badge>
        return <span className="text-muted-foreground text-sm">—</span>
      }
    },
    {
      accessorKey: 'amount',
      header: () => <p>Monto</p>,
      cell: ({ cell }) => <span className="font-mono">{formatMoney(cell.row.original.amount)}</span>
    }
  ]
}
