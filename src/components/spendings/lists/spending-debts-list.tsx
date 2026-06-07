'use client'

import { PayDebtDialog } from '@/components/groups/dialogs/pay-debt-dialog'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetCurrentDebts } from '@/data/spendings'
import { formatMoney } from '@/lib/money'
import { cn } from '@/lib/utils'

export const SpendingDebtsList = ({ groupId, spendId }: { groupId: string, spendId: string }) => {
  const { data: currentDebts, isLoading: isLoadingList } = useGetCurrentDebts({ groupId, spendId })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lo que debes</CardTitle>
        <CardDescription>
          Personas a las que les debes dinero por este gasto.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentDebts?.length === 0 && <p className="text-sm text-muted-foreground">No debés nada en este gasto</p>}

        {isLoadingList && (
          <>
            <RowSkeleton buttonText="Pagado" />
            <RowSkeleton buttonText="Pagado" />
            <RowSkeleton buttonText="Pagado" />
          </>
        )}

        {currentDebts?.map((debt: {
          id: string
          amount: number
          creditor?: { name?: string | null }
        }) => (
          <Row
            key={debt.id}
            name={debt.creditor?.name ?? 'Usuario'}
            amount={debt.amount}
            groupId={groupId}
            spendId={spendId}
            debtId={debt.id}
          />
        ))}
      </CardContent>
    </Card>
  )
}

const Row = ({
  name,
  amount,
  groupId,
  spendId,
  debtId
}: {
  name: string
  amount: number
  groupId: string
  spendId: string
  debtId: string
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={cn(buttonVariants({ variant: 'secondary', size: 'icon' }), 'rounded-full')}>
          {name[0]}
        </div>

        <div>
          <p className="font-medium">{name}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <p className="font-medium text-sm">{formatMoney(amount)}</p>
        <PayDebtDialog
          groupId={groupId}
          spendId={spendId}
          debtId={debtId}
          crediterName={name}
          amount={amount}
          triggerVariant="outline"
        />
      </div>
    </div>
  )
}

const RowSkeleton = ({ buttonText }: { buttonText: string }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div>
          <Skeleton className="h-4 w-24 mb-1" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Skeleton className="h-4 w-16" />
        <Button variant="outline" size="sm" disabled>
          {buttonText}
        </Button>
      </div>
    </div>
  )
}

export const SpendingDebtsListSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="w-40 h-10" />
        <Skeleton className="w-40 h-4" />
      </CardHeader>
      <CardContent className="space-y-4">
        <RowSkeleton buttonText="Pagar" />
        <RowSkeleton buttonText="Pagar" />
        <RowSkeleton buttonText="Pagar" />
      </CardContent>
    </Card>
  )
}
