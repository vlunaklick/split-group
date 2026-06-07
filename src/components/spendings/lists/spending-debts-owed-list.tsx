'use client'

import { ForgiveDebtDialog } from '@/components/groups/dialogs/forgive-debt-dialog'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetOwedDebts } from '@/data/spendings'
import { formatMoney } from '@/lib/money'

export const SpendingDebtsOwedList = ({ groupId, spendId }: { groupId: string, spendId: string }) => {
  const { data: owedDebts, isLoading: isLoadingList } = useGetOwedDebts({ groupId, spendId })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Te deben</CardTitle>
        <CardDescription>
          Personas que te deben dinero por este gasto.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {owedDebts?.length === 0 && <p className="text-sm text-muted-foreground">Nadie te debe en este gasto</p>}

        {isLoadingList && (
          <>
            <RowSkeleton buttonText="Perdonar" />
            <RowSkeleton buttonText="Perdonar" />
            <RowSkeleton buttonText="Perdonar" />
          </>
        )}

        {owedDebts?.map((debt: {
          id: string
          amount: number
          debter?: { name?: string | null }
        }) => (
          <Row
            key={debt.id}
            name={debt.debter?.name ?? 'Usuario'}
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
        <Avatar>
          <AvatarFallback>{name[0]}</AvatarFallback>
        </Avatar>

        <div>
          <p className="font-medium">{name}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <p className="font-medium text-sm">{formatMoney(amount)}</p>
        <ForgiveDebtDialog
          groupId={groupId}
          spendId={spendId}
          debtId={debtId}
          debterName={name}
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

export const SpendingDebtsOwedListSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-4 w-40" />
      </CardHeader>
      <CardContent className="space-y-4">
        <RowSkeleton buttonText="Perdonar" />
        <RowSkeleton buttonText="Perdonar" />
        <RowSkeleton buttonText="Perdonar" />
      </CardContent>
    </Card>
  )
}
