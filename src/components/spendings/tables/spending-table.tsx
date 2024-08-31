import { SpendingIcon, SpendingTypes } from '@/components/spending-icons'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatDate } from '@/lib/dates'
import { formatMoney } from '@/lib/money'
import { cn } from '@/lib/utils'
import Link from 'next/link'

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
}

export function SpendingTable ({ data, groupId }: { data: SpendingTableType[], groupId: string }) {
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
        {data.map((spending: SpendingTableType) => (
          <TableRow key={spending.id}>
            <TableCell>{spending.name}</TableCell>
            <TableCell>
              <div className='flex items-center gap-4'>
                <SpendingIcon type={spending.category as SpendingTypes} className='text-muted-foreground/80' />
                {spending.category}
              </div>
            </TableCell>
            <TableCell>{formatDate(spending.date)}</TableCell>
            <TableCell>
              {spending.hasDebt && <Badge variant='destructive' className='w-max'>Debes</Badge>}
              {spending.someoneOwesYou && <Badge variant="secondary" className='w-max'>Te deben</Badge>}
              {!spending.someoneOwesYou && !spending.hasDebt && <Badge variant="default" className='w-max'>-</Badge>}
            </TableCell>
            <TableCell className="text-right">{formatMoney(spending.amount)}</TableCell>
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

export function MobileSpendingTable ({ data, groupId }: { data: SpendingTableType[], groupId: string }) {
  return (
    <section className='sm:hidden flex flex-col gap-4'>
      {data.map((spending: SpendingTableType) => (
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
