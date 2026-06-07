'use client'

import { forgiveAllDebt, payAllDebt } from '@/app/(overview)/groups/[groupId]/actions'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetDebts } from '@/data/spendings'
import { formatMoney } from '@/lib/money'
import { cn } from '@/lib/utils'
import { useTimeAgo } from '@/utils/time'
import { displayToast } from '@/utils/toast-display'
import { useMemo, useState } from 'react'
import { useSWRConfig } from 'swr'

type Debt = { name: string, userId: string, amount: number, isDebter: boolean, createdAt: Date, id?: string }

export const Debts = ({ groupId }: { groupId: string }) => {
  const { data: debts, isLoading: isLoadingDebts } = useGetDebts({ groupId })

  const netBalance = useMemo(() => {
    if (!debts?.length) return 0
    return debts.reduce((acc: number, debt: Debt) => {
      return acc + (debt.isDebter ? debt.amount : -debt.amount)
    }, 0)
  }, [debts])

  return (
    <Card className='md:max-w-[526px] w-full h-min'>
      <CardHeader>
        <CardTitle>Tu balance</CardTitle>
        <CardDescription>
          {debts?.length
            ? 'Resolvé deudas con un clic'
            : 'No hay deudas pendientes en este grupo'}
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        {!isLoadingDebts && debts && debts.length > 0 && (
          <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
            <p className="text-xs text-muted-foreground">Balance neto</p>
            <p className={cn(
              'font-mono text-xl font-medium',
              netBalance > 0 && 'text-success',
              netBalance < 0 && 'text-destructive'
            )}>
              {netBalance >= 0 ? '+' : ''}{formatMoney(netBalance)}
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              {netBalance > 0 ? 'Te deben más de lo que debés' : netBalance < 0 ? 'Debés más de lo que te deben' : 'Estás equilibrado'}
            </p>
          </div>
        )}

        {isLoadingDebts && (
          <>
            <DebtItemSkeleton />
            <DebtItemSkeleton />
            <DebtItemSkeleton />
          </>
        )}

        {!isLoadingDebts && debts && debts.map((debt: Debt) => {
          const createdAtDate = new Date(debt.createdAt)
          return (
            <DebtItem key={(debt.id ?? debt.userId) + createdAtDate.getTime()} debt={debt} groupId={groupId} />
          )
        })}

        {!isLoadingDebts && debts && debts.length === 0 && (
          <p className="text-center text-sm text-muted-foreground">Todos al día — no hay nada pendiente</p>
        )}
      </CardContent>
    </Card>
  )
}

const DebtItem = ({ debt, groupId }: { debt: Debt, groupId: string }) => {
  const createdAtDate = new Date(debt.createdAt)
  const { timeAgo } = useTimeAgo(createdAtDate.getTime())
  const { mutate } = useSWRConfig()
  const [isLoading, setIsLoading] = useState(false)

  const handlePayDebt = async () => {
    setIsLoading(true)
    try {
      await payAllDebt({ groupId, crediterId: debt.userId })
      displayToast('Marcado como pagado', 'success')
      mutate(['debts', groupId])
    } catch (error) {
      displayToast('No se pudo marcar como pagado', 'error')
    }
    setIsLoading(false)
  }

  const handleForgiveDebt = async () => {
    setIsLoading(true)
    try {
      await forgiveAllDebt({ groupId, debterId: debt.userId })
      displayToast('Deuda perdonada', 'success')
      mutate(['debts', groupId])
    } catch (error) {
      displayToast('No se pudo perdonar la deuda', 'error')
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
            {debt.isDebter ? 'Te debe' : 'Le debés'} · {timeAgo.toLocaleLowerCase()}
          </p>
        </div>
      </div>

      <div className="flex flex-row gap-4 min-[500px]:ml-auto items-center ml-14">
        <div className={cn('font-medium font-mono', debt.isDebter ? 'text-success' : 'text-destructive')}>
          {formatMoney(debt.isDebter ? debt.amount : -debt.amount)}
        </div>

        {!debt.isDebter && (
          <Button onClick={handlePayDebt} variant='secondary' size="sm" disabled={isLoading}>
            Pagado
          </Button>
        )}

        {debt.isDebter && (
          <Button onClick={handleForgiveDebt} variant='secondary' size="sm" disabled={isLoading}>
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
