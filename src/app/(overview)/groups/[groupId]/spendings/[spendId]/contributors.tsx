'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getParticipants, getPayers } from './actions'
import { cn } from '@/lib/utils'
import useSWR from 'swr'
import { buttonVariants } from '@/components/ui/button'
import { formatMoney } from '@/lib/money'
import { Skeleton } from '@/components/ui/skeleton'

export const Contributors = ({ groupId, spendId }: { groupId: string; spendId: string }) => {
  const { data: payers, isLoading: isLoadingPayers } = useSWR(['spendingPayers', groupId, spendId], async ([_, groupId, spendId]) => {
    return await getPayers({ groupId, spendId })
  })

  const { data: participants, isLoading: isLoadingParticipants } = useSWR(['spendingParticipants', groupId, spendId], async ([_, groupId, spendId]) => {
    return await getParticipants({ groupId, spendId })
  })

  return (
    <Card className='h-min'>
      <CardHeader>
        <CardTitle>Contribuyentes</CardTitle>
        <CardDescription>Estas son las personas que participaron del gasto.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          {isLoadingPayers && <SkeletonRow hasValue />}
          {payers?.map((payer) => (
            <Row key={payer.id} name={payer.payer.name ?? payer.payer.username ?? ''} value={payer.amount} />
          ))}
          {isLoadingParticipants && (
            <>
              <SkeletonRow hasValue={false} />
              <SkeletonRow hasValue={false} />
              <SkeletonRow hasValue={false} />
            </>
          )}
          {participants?.map((participant) => (
            <Row key={participant.id} name={participant.name ?? participant.username ?? ''} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

const Row = ({ name, value }: { name: string, value?: number }) => {
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
       {value && <p className="font-medium text-sm">{formatMoney(value)}</p>}
      </div>
    </div>
  )
}

const SkeletonRow = ({ hasValue }: { hasValue: boolean }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={cn(buttonVariants({ variant: 'secondary', size: 'icon' }), 'rounded-full')}>
          <Skeleton className="w-4 h-4 rounded-full" />
        </div>

        <div>
          <Skeleton className="w-20 h-4" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        {hasValue && (
          <Skeleton className="w-10 h-4" />
        )}
      </div>
    </div>
  )
}
