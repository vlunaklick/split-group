'use client'

import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetOwedDebts } from '@/data/spendings'
import { formatMoney } from '@/lib/money'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { toast } from 'sonner'
import { useSWRConfig } from 'swr'
import { forgiveDebt } from '../../../app/(overview)/groups/[groupId]/spendings/actions'

// TODO: Ver que solo se le pase spendId

export const SpendingDebtsOwedList = ({ groupId, spendId }: { groupId: string, spendId: string }) => {
  const { data: owedDebts, isLoading: isLoadingList } = useGetOwedDebts({ groupId, spendId })
  const { mutate } = useSWRConfig()
  const [isLoading, setIsLoading] = useState(false)

  const handleForgiveDebt = async (debtId: string) => {
    setIsLoading(true)
    try {
      await forgiveDebt({ debtId })
      toast.success('Deuda perdonada')
      mutate(['owed-debts', groupId, spendId])
    } catch (error) {
      toast.error('Error al perdonar deuda')
    }
    setIsLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Adeudan</CardTitle>
        <CardDescription>
          Estas son las personas que te deben dinero.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {owedDebts?.length === 0 && <p className='text-muted-foreground/50'>No te deben dinero</p>}

        {isLoadingList && (
          <>
            <RowSkeleton buttonText="Perdonar" />
            <RowSkeleton buttonText="Perdonar" />
            <RowSkeleton buttonText="Perdonar" />
          </>
        )}

        {owedDebts?.map((debt: any) => (
          <Row key={debt.id} name={debt.debter?.name as string} amount={debt.amount} buttonText="Perdonar" onButtonClick={() => handleForgiveDebt(debt.id)} isLoading={isLoading} />
        ))}
      </CardContent>
    </Card>
  )
}

const Row = ({ name, amount, buttonText, onButtonClick, isLoading }: { name: string, amount: number, buttonText: string, onButtonClick: () => void, isLoading: boolean }) => {
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
        <Button variant="outline" size="sm" disabled={isLoading} onClick={onButtonClick}>
          {buttonText}
        </Button>
      </div>
    </div>
  )
}

const RowSkeleton = ({ buttonText }: {buttonText: string}) => {
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
