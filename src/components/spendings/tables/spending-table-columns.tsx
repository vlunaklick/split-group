'use client'

import { type ColumnDef } from '@tanstack/react-table'

import { SpendingIcon, SpendingTypes } from '@/components/spending-icons'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { formatDate } from '@/lib/dates'
import { SpendingTableType } from '@/lib/exports'
import { formatMoney } from '@/lib/money'
import Link from 'next/link'

export function getColumns (): ColumnDef<SpendingTableType>[] {
  return [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <p>Nombre</p>
      )
    },
    {
      accessorKey: 'category',
      header: ({ column }) => (
        <p>Category</p>
      ),
      cell: ({ cell }) => {
        const spending = cell.row.original

        return (
          <div className='flex items-center gap-4'>
            <SpendingIcon type={spending.category as SpendingTypes} className='text-muted-foreground/80' />
            {spending.category}
          </div>
        )
      }
    },
    {
      accessorKey: 'date',
      header: ({ column }) => (
        <p>Fecha</p>
      ),
      cell: ({ cell }) => formatDate(cell.row.original.date)
    },
    {
      accessorKey: 'hasDebt',
      header: ({ column }) => (
        <p>Estado</p>
      ),
      cell: ({ cell }) => {
        const spending = cell.row.original

        return (
          <>
            {spending.hasDebt && <Badge variant='destructive' className='w-max'>Debes</Badge>}
            {spending.someoneOwesYou && <Badge variant="secondary" className='w-max'>Te deben</Badge>}
            {!spending.someoneOwesYou && !spending.hasDebt && <Badge variant="default" className='w-max'>-</Badge>}
          </>
        )
      }
    },
    {
      accessorKey: 'amount',
      header: ({ column }) => (
        <p>Monto</p>
      ),
      cell: ({ cell }) => formatMoney(cell.row.original.amount)
    },
    {
      id: 'actions',
      cell: ({ cell }) => {
        const spending = cell.row.original

        const url = `/groups/${spending.groupId}/spendings/${spending.id}`

        return (
          <Link href={url} className={buttonVariants({ variant: 'outline' })}>
            Ver
          </Link>
        )
      },
      size: 40
    }
  ]
}
