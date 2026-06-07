'use client'

import { forgiveAllDebt, sendDebtReminder } from '@/app/(overview)/groups/[groupId]/actions'
import { PayDebtDialog } from './dialogs/pay-debt-dialog'
import { SettlementPlan } from './settlement-plan'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetDebts } from '@/data/spendings'
import { formatMoney } from '@/lib/money'
import { cn } from '@/lib/utils'
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
    <section className="grid h-full w-full min-w-0 gap-4">
      <SettlementPlan groupId={groupId} />

      <div className="grid gap-3">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="section-label">Tu balance</h2>
          {!isLoadingDebts && debts && debts.length > 0 && (
            <p className={cn(
              'font-mono text-sm',
              netBalance > 0 && 'text-success',
              netBalance < 0 && 'text-destructive',
              netBalance === 0 && 'text-muted-foreground'
            )}>
              {netBalance >= 0 ? '+' : ''}{formatMoney(netBalance)}
            </p>
          )}
        </div>

        <ul className="surface-panel flex min-h-[180px] flex-col divide-y divide-border">
          {isLoadingDebts && (
            <>
              <DebtItemSkeleton />
              <DebtItemSkeleton />
            </>
          )}

          {!isLoadingDebts && debts?.map((debt: Debt) => (
            <li key={(debt.id ?? debt.userId) + new Date(debt.createdAt).getTime()}>
              <DebtItem debt={debt} groupId={groupId} />
            </li>
          ))}

          {!isLoadingDebts && debts && debts.length === 0 && (
            <li className="flex flex-1 items-center justify-center px-4 py-10 text-center text-sm text-muted-foreground">
              Al día
            </li>
          )}
        </ul>
      </div>
    </section>
  )
}

const DebtItem = ({ debt, groupId }: { debt: Debt, groupId: string }) => {
  const { mutate } = useSWRConfig()
  const [isLoading, setIsLoading] = useState(false)

  const handleForgiveDebt = async () => {
    setIsLoading(true)
    try {
      await forgiveAllDebt({ groupId, debterId: debt.userId })
      displayToast('Deuda perdonada', 'success')
      mutate(['debts', groupId])
      mutate(['group-settlement', groupId])
    } catch (error) {
      displayToast('No se pudo perdonar la deuda', 'error')
    }
    setIsLoading(false)
  }

  const handleRemind = async () => {
    setIsLoading(true)
    try {
      await sendDebtReminder({ groupId, debterId: debt.userId })
      displayToast('Recordatorio enviado', 'success')
    } catch (error) {
      displayToast(error instanceof Error ? error.message : 'No se pudo enviar el recordatorio', 'error')
    }
    setIsLoading(false)
  }

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{debt.name}</p>
        <p className="text-xs text-muted-foreground">
          {debt.isDebter ? 'Te debe' : 'Le debés'}
        </p>
      </div>

      <p className={cn(
        'shrink-0 font-mono text-sm',
        debt.isDebter ? 'text-success' : 'text-destructive'
      )}>
        {formatMoney(debt.isDebter ? debt.amount : -debt.amount)}
      </p>

      {!debt.isDebter && (
        <PayDebtDialog
          groupId={groupId}
          crediterId={debt.userId}
          crediterName={debt.name}
          amount={debt.amount}
        />
      )}

      {debt.isDebter && (
        <>
          <Button onClick={handleRemind} variant="ghost" size="sm" className="h-8 px-2 text-xs" disabled={isLoading}>
            Recordar
          </Button>
          <Button onClick={handleForgiveDebt} variant="ghost" size="sm" className="h-8 px-2 text-xs" disabled={isLoading}>
            Perdonar
          </Button>
        </>
      )}
    </div>
  )
}

const DebtItemSkeleton = () => (
  <li className="flex items-center gap-3 px-4 py-3">
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-3 w-16" />
    </div>
    <Skeleton className="h-4 w-14" />
    <Skeleton className="h-8 w-16" />
  </li>
)

export const DebtsSkeleton = () => {
  return (
    <section className="grid h-full w-full min-w-0 gap-4">
      <Skeleton className="h-24 w-full rounded-lg" />
      <div className="grid gap-3">
        <Skeleton className="h-3 w-16" />
        <ul className="surface-panel flex min-h-[180px] flex-col divide-y divide-border">
          <DebtItemSkeleton />
          <DebtItemSkeleton />
        </ul>
      </div>
    </section>
  )
}
