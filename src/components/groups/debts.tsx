'use client'

import { forgiveAllDebt, payAllDebt } from '@/app/(overview)/groups/[groupId]/actions'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetDebts } from '@/data/spendings'
import { formatMoney } from '@/lib/money'
import { cn } from '@/lib/utils'
import { useTimeAgo } from '@/utils/time'
import { useState } from 'react'
import { toast } from 'sonner'
import { useSWRConfig } from 'swr'

export const Debts = ({ groupId }: { groupId: string }) => {
  const { data: debts, isLoading: isLoadingDebts } = useGetDebts({ groupId })

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
          <DebtItem key={debt.id + debt.createdAt.getTime()} debt={debt} groupId={groupId} />
        ))}

        {!isLoadingDebts && debts && debts.length === 0 && (
          <p className="text-center text-muted-foreground">No tienes deudas pendientes</p>
        )}
      </CardContent>
    </Card>
  )
}

const DebtItem = ({ debt, groupId }: { debt: { name: string, userId: string, amount: number, isDebter: boolean, createdAt: Date }, groupId: string }) => {
  const { timeAgo } = useTimeAgo(debt.createdAt.getTime())
  const { mutate } = useSWRConfig()
  const [isLoading, setIsLoading] = useState(false)

  const handlePayDebt = async () => {
    setIsLoading(true)
    try {
      await payAllDebt({ groupId, crediterId: debt.userId })
      toast.success('Deuda pagada')
      mutate(['lastDebts', groupId])
    } catch (error) {
      toast.error('No se pudo pagar la deuda')
    }
    setIsLoading(false)
  }

  const handleForgiveDebt = async () => {
    setIsLoading(true)
    try {
      await forgiveAllDebt({ groupId, debterId: debt.userId })
      toast.success('Deuda perdonada')
      mutate(['lastDebts', groupId])
    } catch (error) {
      toast.error('No se pudo perdonar la deuda')
    }
    setIsLoading(false)
  }

  return (
    <div className="flex min-[500px]:items-center gap-4 min-[500px]:flex-row flex-col">
      <div className="flex items-center gap-4 w-full">
        <div className={cn(buttonVariants({ variant: 'secondary', size: 'icon' }), 'rounded-full')}>
          {debt.name[0]}
        </div>
        <div className="grid gap-1">
          <p className="text-sm font-medium leading-none">
            {debt.name}
          </p>
          <p className="text-sm text-muted-foreground/70">
            {debt.isDebter ? 'Te debe' : 'Le debes'} · {timeAgo.toLocaleLowerCase()}
          </p>
        </div>
      </div>

      <div className="flex flex-row gap-4 min-[500px]:ml-auto items-center ml-14">
        <div className={cn('font-medium', debt.isDebter ? 'text-green-500' : 'text-red-500')}>
          {formatMoney(debt.isDebter ? debt.amount : -debt.amount)}
        </div>

        {!debt.isDebter && (
          <Button onClick={handlePayDebt} variant='secondary' disabled={isLoading}>
            Pagar
          </Button>
        )}

        {debt.isDebter && (
          <Button onClick={handleForgiveDebt} variant='secondary' disabled={isLoading}>
            Perdonar
          </Button>
        )}
      </div>
    </div>
  )
}

const DebtItemSkeleton = () => {
  return (
    <div className="flex min-[500px]:items-center gap-4 min-[500px]:flex-row flex-col">
      <div className="flex items-center gap-4 w-full">
        <div className={cn(buttonVariants({ variant: 'secondary', size: 'icon' }), 'rounded-full')}>
          <Skeleton className="w-8 h-8 rounded-full" />
        </div>
        <div className="grid gap-1">
          <Skeleton className="w-20 h-4" />
          <Skeleton className="w-20 h-4" />
        </div>
      </div>

      <div className="flex flex-row gap-4 min-[500px]:ml-auto items-center ml-14">
        <div className="font-medium">
          <Skeleton className="w-8 h-4" />
        </div>

        <Skeleton className="w-20 h-8" />
      </div>
    </div>
  )
}

export const DebtsSkeleton = () => {
  return (
    <Card className='md:max-w-[526px] w-full h-min'>
      <CardHeader>
        <Skeleton className="w-20 h-6" />
        <Skeleton className="w-20 h-4" />
      </CardHeader>
      <CardContent className='space-y-4'>
        <DebtItemSkeleton />
        <DebtItemSkeleton />
        <DebtItemSkeleton />
      </CardContent>
    </Card>
  )
}
