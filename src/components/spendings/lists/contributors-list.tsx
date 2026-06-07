'use client'

import { buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetPayers, useGetSpendingParticipants } from '@/data/spendings'
import { formatMoney } from '@/lib/money'
import { cn } from '@/lib/utils'

export const ContributorsList = ({ groupId, spendId }: { groupId: string; spendId: string }) => {
  const { data: payers, isLoading: isLoadingPayers } = useGetPayers({ groupId, spendId })
  const { data: participants, isLoading: isLoadingParticipants } = useGetSpendingParticipants({ groupId, spendId })

  return (
    <Card className="h-min">
      <CardHeader>
        <CardTitle>División</CardTitle>
        <CardDescription>Quién pagó y quién debe</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <section className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Pagaron</p>
          {isLoadingPayers && <SkeletonRow hasValue />}
          {!isLoadingPayers && payers?.length === 0 && (
            <p className="text-sm text-muted-foreground">Sin pagadores registrados</p>
          )}
          {payers?.map((payer: any) => (
            <Row key={payer.id} name={payer.payer.name ?? payer.payer.username ?? ''} value={payer.amount} badge="Pagó" />
          ))}
        </section>

        <section className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Deben</p>
          {isLoadingParticipants && (
            <>
              <SkeletonRow hasValue={false} />
              <SkeletonRow hasValue={false} />
            </>
          )}
          {!isLoadingParticipants && participants?.length === 0 && (
            <p className="text-sm text-muted-foreground">Nadie debe en este gasto</p>
          )}
          {participants?.map((participant: any) => (
            <Row key={participant.id} name={participant.name ?? participant.username ?? ''} badge="Debe" />
          ))}
        </section>
      </CardContent>
    </Card>
  )
}

const Row = ({ name, value, badge }: { name: string, value?: number, badge: string }) => {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex min-w-0 items-center gap-2">
        <div className={cn(buttonVariants({ variant: 'secondary', size: 'icon' }), 'shrink-0 rounded-full')}>
          {(name || '?')[0]}
        </div>
        <p className="truncate font-medium">{name}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {value != null && value > 0 && (
          <span className="font-mono text-sm font-medium">{formatMoney(value)}</span>
        )}
        <Badge variant="outline" className="text-xs">{badge}</Badge>
      </div>
    </div>
  )
}

const SkeletonRow = ({ hasValue }: { hasValue: boolean }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-9 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
      {hasValue && <Skeleton className="h-4 w-12" />}
    </div>
  )
}

export const ContributorsListSkeleton = () => {
  return (
    <Card className="h-min">
      <CardHeader>
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-4 w-40" />
      </CardHeader>
      <CardContent className="space-y-4">
        <SkeletonRow hasValue />
        <SkeletonRow hasValue={false} />
        <SkeletonRow hasValue={false} />
      </CardContent>
    </Card>
  )
}
