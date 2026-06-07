'use client'

import { CreateSpendingSheet } from '@/components/spendings/sheets/create-spending-sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetLastSpendings } from '@/data/spendings'
import { formatDate } from '@/lib/dates'
import { formatMoney } from '@/lib/money'
import Link from 'next/link'
import { SpendingWithOwner } from '@/app/(overview)/groups/[groupId]/types'

export const Spendings = ({ groupId }: { groupId: string }) => {
  const { data: spendings, isLoading: isLoadingSpendings } = useGetLastSpendings({ groupId })
  const count = spendings?.length ?? 0

  return (
    <section className="grid h-full w-full min-w-0 gap-3">
      <div className="flex items-center justify-between gap-4">
        <h2 className="section-label">Gastos</h2>
        {count > 0 && (
          <Link
            href={`/groups/${groupId}/spendings`}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Ver todos
          </Link>
        )}
      </div>

      <ul className="surface-panel flex min-h-[220px] flex-col divide-y divide-border">
        {isLoadingSpendings && (
          <>
            <SpendingItemSkeleton />
            <SpendingItemSkeleton />
            <SpendingItemSkeleton />
          </>
        )}

        {!isLoadingSpendings && spendings?.map((spending: SpendingWithOwner) => (
          <li key={spending.id}>
            <SpendingItem groupId={groupId} spending={spending} />
          </li>
        ))}

        {!isLoadingSpendings && count === 0 && (
          <li className="flex min-h-[220px] flex-col items-center justify-center gap-3 px-4 py-10 text-center">
            <p className="text-sm text-muted-foreground">Sin gastos todavía</p>
            <CreateSpendingSheet groupId={groupId} variant="default" className="h-9" />
          </li>
        )}
      </ul>
    </section>
  )
}

const SpendingItem = ({ groupId, spending }: { groupId: string, spending: SpendingWithOwner }) => {
  return (
    <Link
      href={`/groups/${groupId}/spendings/${spending.id}`}
      className="list-row px-4"
    >
      <div className="min-w-0 flex-1 grid gap-0.5">
        <p className="truncate text-sm font-medium">{spending.name}</p>
        <p className="truncate text-xs text-muted-foreground">
          {formatDate(spending.createdAt)} · {spending.owner.name}
        </p>
      </div>
      <span className="shrink-0 font-mono text-sm">{formatMoney(spending.value)}</span>
    </Link>
  )
}

const SpendingItemSkeleton = () => (
  <li className="flex items-center gap-3 px-4 py-3">
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-3 w-24" />
    </div>
    <Skeleton className="h-4 w-16" />
  </li>
)

export const SpendingsSkeleton = () => {
  return (
    <section className="grid h-full w-full min-w-0 gap-3">
      <Skeleton className="h-3 w-16" />
      <ul className="surface-panel flex min-h-[220px] flex-col divide-y divide-border">
        <SpendingItemSkeleton />
        <SpendingItemSkeleton />
        <SpendingItemSkeleton />
      </ul>
    </section>
  )
}
