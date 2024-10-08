'use client'

import { SpendingIcon } from '@/components/spending-icons'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetLastSpendings } from '@/data/spendings'
import { formatDate } from '@/lib/dates'
import { formatMoney } from '@/lib/money'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { CreateSpendingSheet } from '@/components/spendings/sheets/create-spending-sheet'
import { SpendingWithOwner } from '@/app/(overview)/groups/[groupId]/types'

export const Spendings = ({ groupId }: { groupId: string }) => {
  const { data: spendings, isLoading: isLoadingSpendings } = useGetLastSpendings({ groupId })

  return (
    <Card className='md:max-w-[526px] w-full h-min'>
      <CardHeader className='flex justify-between flex-row items-center'>
        <div className='flex flex-col gap-2'>
          <CardTitle>Gastos</CardTitle>
          <CardDescription>Últimos gastos ingresados</CardDescription>
        </div>

        <CreateSpendingSheet groupId={groupId} />
      </CardHeader>
      <CardContent className='space-y-4'>
        {isLoadingSpendings && (
          <>
            <SpendingItemSkeleton />
            <SpendingItemSkeleton />
            <SpendingItemSkeleton />
          </>
        )}
        {!isLoadingSpendings && spendings?.map((spending: any) => <SpendingItem key={spending.id} spending={spending} />)}

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

export const SpendingsSkeleton = () => {
  return (
    <Card className='md:max-w-[526px] w-full h-min'>
      <CardHeader className='flex justify-between flex-row items-center'>
        <div className='flex flex-col gap-2'>
          <Skeleton className="w-40 h-6" />
          <Skeleton className="w-40 h-4" />
        </div>
      </CardHeader>
      <CardContent className='space-y-4'>
        <SpendingItemSkeleton />
        <SpendingItemSkeleton />
        <SpendingItemSkeleton />
      </CardContent>
    </Card>
  )
}
