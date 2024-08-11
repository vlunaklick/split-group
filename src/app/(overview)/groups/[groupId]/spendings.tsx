'use client'

import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { getLastSpendings } from './actions'
import useSWR from 'swr'
import { cn } from '@/lib/utils'
import { SpendingWithOwner } from './types'
import { SpendingIcon } from '@/components/spending-icons'
import { formatMoney } from '@/lib/money'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate } from '@/lib/dates'

export const Spendings = ({ userId, groupId }: { userId: string, groupId: string }) => {
  const { data: spendings, isLoading: isLoadingSpendings } = useSWR(['lastSpendings', groupId], async () => {
    return await getLastSpendings(groupId)
  })

  return (
    <Card className='md:max-w-[526px] w-full h-min'>
      <CardHeader className='flex justify-between flex-row items-center'>
        <div className='flex flex-col gap-2'>
          <CardTitle>Gastos</CardTitle>
          <CardDescription>Últimos gastos ingresados</CardDescription>
        </div>

        <Link className={buttonVariants({ variant: 'default' })} href={`/groups/${groupId}/spendings/new`}>
          Nuevo gasto
        </Link>
      </CardHeader>
      <CardContent className='space-y-4'>
        {isLoadingSpendings && (
          <>
            <SpendingItemSkeleton />
            <SpendingItemSkeleton />
            <SpendingItemSkeleton />
          </>
        )}
        {!isLoadingSpendings && spendings?.map((spending) => <SpendingItem key={spending.id} spending={spending} />)}

        {spendings?.length === 0 && (
          <p className='text-center text-muted-foreground'>No hay gastos ingresados</p>
        )}

        <Link href={`/groups/${groupId}/spendings`} className={cn(buttonVariants({ variant: 'default' }), 'w-full')}>
          Ver todos
        </Link>
      </CardContent>
    </Card>
  )
}

const SpendingItem = ({ spending }: { spending: SpendingWithOwner }) => {
  return (
    <div className="flex items-center gap-4">
      <div className={cn(buttonVariants({ variant: 'secondary', size: 'icon' }), 'rounded-full')}>
        <SpendingIcon type={spending.category.name as 'Comida' | 'Transporte' | 'Entretenimiento' | 'Salud' | 'Educación' | 'Otros'} />
      </div>
      <div className="grid gap-1">
        <p className="text-sm font-medium leading-none">
          {spending.name}
        </p>
        <p className="text-sm text-muted-foreground/70">
          {formatDate(spending.createdAt)} · {spending.owner.name}
        </p>
      </div>
      <div className="ml-auto font-medium">{formatMoney(spending.value)}</div>
    </div>
  )
}

const SpendingItemSkeleton = () => {
  return (
    <div className="flex items-center gap-4">
      <div className={cn(buttonVariants({ variant: 'secondary', size: 'icon' }), 'rounded-full')}>
        <Skeleton className="w-8 h-8 rounded-full" />
      </div>
      <div className="grid gap-1">
        <Skeleton className="w-20 h-4" />
        <Skeleton className="w-20 h-4" />
      </div>
      <div className="ml-auto font-medium">
        <Skeleton className="w-8 h-4" />
      </div>
    </div>
  )
}
