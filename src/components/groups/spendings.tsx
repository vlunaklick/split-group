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
import { SpendingWithOwner } from '@/app/(overview)/groups/[groupId]/types'

export const Spendings = ({ groupId }: { groupId: string }) => {
  const { data: spendings, isLoading: isLoadingSpendings } = useGetLastSpendings({ groupId })
  const count = spendings?.length ?? 0

  return (
    <Card className='md:max-w-[526px] w-full h-min'>
      <CardHeader>
        <CardTitle>Gastos recientes</CardTitle>
        <CardDescription>
          {count > 0 ? 'Toca un gasto para ver el detalle' : 'Aún no hay gastos en este grupo'}
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        {isLoadingSpendings && (
          <>
            <SpendingItemSkeleton />
            <SpendingItemSkeleton />
            <SpendingItemSkeleton />
          </>
        )}
        {!isLoadingSpendings && spendings?.map((spending: SpendingWithOwner) => (
          <SpendingItem key={spending.id} groupId={groupId} spending={spending} />
        ))}

        {count > 0 && (
          <Link
            href={`/groups/${groupId}/spendings`}
            className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}
          >
            Ver todos los gastos
          </Link>
        )}
      </CardContent>
    </Card>
  )
}

const SpendingItem = ({ groupId, spending }: { groupId: string, spending: SpendingWithOwner }) => {
  return (
    <Link
      href={`/groups/${groupId}/spendings/${spending.id}`}
      className="flex items-center gap-4 rounded-md p-2 -mx-2 transition-colors hover:bg-muted/50"
    >
      <div className={cn(buttonVariants({ variant: 'secondary', size: 'icon' }), 'rounded-full shrink-0')}>
        <SpendingIcon type={spending.category.name as 'Comida' | 'Transporte' | 'Entretenimiento' | 'Salud' | 'Educación' | 'Otros'} />
      </div>
      <div className="grid gap-1 min-w-0">
        <p className="text-sm font-medium leading-none truncate">
          {spending.name}
        </p>
        <p className="text-sm text-muted-foreground/70">
          {formatDate(spending.createdAt)} · {spending.owner.name}
        </p>
      </div>
      <div className="ml-auto font-medium shrink-0">{formatMoney(spending.value)}</div>
    </Link>
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
      <CardHeader>
        <Skeleton className="w-40 h-6" />
        <Skeleton className="w-40 h-4" />
      </CardHeader>
      <CardContent className='space-y-4'>
        <SpendingItemSkeleton />
        <SpendingItemSkeleton />
        <SpendingItemSkeleton />
      </CardContent>
    </Card>
  )
}
