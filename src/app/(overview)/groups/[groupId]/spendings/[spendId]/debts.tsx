'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getOwedDebts, getCurrentDebts } from './actions'
import useSWR, { useSWRConfig } from 'swr'
import { payDebt, forgiveDebt } from '../actions'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'
import { formatMoney } from '@/lib/money'
import { useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export const SpendDebts = ({ groupId, spendId, userId }: { groupId: string, spendId: string, userId: string }) => {
  const { data: currentDebts, isLoading: isLoadingList } = useSWR(['debts', groupId, spendId, userId], async ([_, groupId, spendId, userId]) => await getCurrentDebts({ groupId, spendId, userId }))
  const { mutate } = useSWRConfig()
  const [isLoading, setIsLoading] = useState(false)

  const handlePayDebt = async (debtId: string) => {
    setIsLoading(true)
    try {
      await payDebt({ debtId })
      toast.success('Deuda pagada')
      mutate(['debts', groupId, spendId, userId])
    } catch (error) {
      toast.error('Error al pagar deuda')
    }
    setIsLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deudas actuales</CardTitle>
        <CardDescription>
          Estas son las personas a las que les debes dinero.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentDebts?.length === 0 && <p className='text-muted-foreground/50'>No tienes deudas pendientes</p>}

        {isLoadingList && (
          <>
            <RowSkeleton buttonText="Pagar" />
            <RowSkeleton buttonText="Pagar" />
            <RowSkeleton buttonText="Pagar" />
          </>
        )}

        {currentDebts?.map(debt => (
          <Row key={debt.id} name={debt.creditor?.name as string} amount={debt.amount} buttonText="Pagar" onButtonClick={() => handlePayDebt(debt.id)} isLoading={isLoading} />
        ))}
      </CardContent>
    </Card>
  )
}

export const SpendDebtsOwned = ({ groupId, spendId, userId }: { groupId: string, spendId: string, userId: string }) => {
  const { data: owedDebts, isLoading: isLoadingList } = useSWR(['owed-debts', groupId, spendId, userId], async ([_, groupId, spendId, userId]) => await getOwedDebts({ groupId, spendId, userId }))
  const { mutate } = useSWRConfig()
  const [isLoading, setIsLoading] = useState(false)

  const handleForgiveDebt = async (debtId: string) => {
    setIsLoading(true)
    try {
      await forgiveDebt({ debtId })
      toast.success('Deuda perdonada')
      mutate(['owed-debts', groupId, spendId, userId])
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

        {owedDebts?.map(debt => (
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
