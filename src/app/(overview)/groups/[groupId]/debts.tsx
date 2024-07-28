'use client'

import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatMoney } from '@/lib/money'
import { cn } from '@/lib/utils'
import { useTimeAgo } from '@/utils/time'
import useSWR from 'swr'
import { getDebts } from './actions'

export const Debts = ({ userId, groupId }: { userId: string, groupId: string }) => {
  const { data: debts, isLoading: isLoadingDebts } = useSWR(['lastDebts', groupId, userId], async ([_, groupId, userId]) => {
    return await getDebts({ groupId, userId })
  })

  return (
    <Card className='md:max-w-[526px] w-full h-min'>
      <CardHeader>
        <CardTitle>Deudas</CardTitle>
        <CardDescription>Dinero que debes o te deben</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>

        {isLoadingDebts && (
          <>
            <DebtItemSkeleton />
            <DebtItemSkeleton />
            <DebtItemSkeleton />
          </>
        )}

        {!isLoadingDebts && debts && debts.map((debt: any) => (
          <DebtItem key={debt.id} debt={debt} />
        ))}

      </CardContent>
    </Card>
  )
}

const DebtItem = ({ debt }: { debt: { name: string, userId: string, amount: number, isDebter: boolean, createdAt: Date } }) => {
  const { timeAgo } = useTimeAgo(debt.createdAt.getTime())

  return (
    <div className="flex items-center gap-4">
      <div className={cn(buttonVariants({ variant: 'secondary', size: 'icon' }), 'rounded-full')}>
        {debt.name[0]}
      </div>
      <div className="grid gap-1">
        <p className="text-sm font-medium leading-none">
          {debt.name}
        </p>
        <p className="text-sm text-zinc-500">
          {debt.isDebter ? 'Te debe' : 'Le debes'} · {timeAgo.toLocaleLowerCase()}
        </p>
      </div>
      <div className={cn('ml-auto font-medium', debt.isDebter ? 'text-green-500' : 'text-red-500')}>
        {formatMoney(debt.isDebter ? debt.amount : -debt.amount)}
      </div>
    </div>
  )
}

const DebtItemSkeleton = () => {
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
