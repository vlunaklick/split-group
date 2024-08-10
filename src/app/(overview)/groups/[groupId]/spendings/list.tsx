'use client'

import useSWR from 'swr'
import { getSpendingsTable } from './actions'
import Link from 'next/link'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatDate } from '@/lib/dates'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { SpendingIcon, SpendingTypes } from '@/components/spending-icons'

type SpendingTable = {
  id: string
  name: string
  date: Date
  amount: number
  category: string
  hasDebt: boolean
  someoneOwesYou: boolean
}

export const SpendingsList = ({ groupId, userId }: { groupId: string, userId: string }) => {
  const { data, error } = useSWR(['spendings', groupId, userId], async ([_, groupId, userId]) => await getSpendingsTable({ groupId, userId }))

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  return (
    <TableDisplay data={data} groupId={groupId} userId={userId} />
  )
}

const TableDisplay = ({ data, groupId, userId }: { data: SpendingTable[], groupId: string, userId: string }) => {
  return (
    <Table className='hidden sm:table'>
      <TableCaption>Lista de gastos del grupo</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="min-w-[200px]">Nombre</TableHead>
          <TableHead>Categoría</TableHead>
          <TableHead className='min-w-[220px]'>Fecha</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Monto</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((spending: SpendingTable) => (
          <TableRow key={spending.id}>
            <TableCell>{spending.name}</TableCell>
            <TableCell>
              <div className='flex items-center gap-4'>
                <SpendingIcon type={spending.category as SpendingTypes} className='text-zinc-500 dark:text-zinc-400' />
                {spending.category}
              </div>
            </TableCell>
            <TableCell>{formatDate(spending.date)}</TableCell>
            <TableCell>
              {spending.hasDebt && <Badge variant='destructive'>Debes</Badge>}
              {spending.someoneOwesYou && <Badge variant="secondary">Te deben</Badge>}
              {!spending.someoneOwesYou && !spending.hasDebt && <Badge variant="default">-</Badge>}
            </TableCell>
            <TableCell className="text-right">{spending.amount}</TableCell>
            <TableCell>
              <Link href={`/groups/${groupId}/spendings/${spending.id}`} className={buttonVariants({ variant: 'outline' })}>
                Ver
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
