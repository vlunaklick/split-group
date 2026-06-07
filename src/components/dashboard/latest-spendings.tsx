import { Skeleton } from '@/components/ui/skeleton'
import { getLatestSpendings } from '@/data/apis/dashboard'
import { formatDate } from '@/lib/dates'
import { formatMoney } from '@/lib/money'
import Link from 'next/link'
import { SpendingWithOwnerAndGroup } from '../../app/(overview)/dashboard/types'

export const LatestsSpendings = async () => {
  const latestSpendings = await getLatestSpendings()

  return (
    <section className="grid gap-3">
      <h2 className="section-label">Reciente</h2>

      {!latestSpendings?.length && (
        <p className="text-sm text-muted-foreground">Sin gastos todavía.</p>
      )}

      {latestSpendings && latestSpendings.length > 0 && (
        <ul className="surface-panel divide-y divide-border">
          {latestSpendings.map((spending) => (
            <li key={spending.id}>
              <SpendingItem spending={spending} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

const SpendingItem = ({ spending }: { spending: SpendingWithOwnerAndGroup }) => {
  return (
    <Link
      href={`/groups/${spending.groupId}/spendings/${spending.id}`}
      className="list-row px-4"
    >
      <div className="min-w-0 flex-1 grid gap-0.5">
        <p className="truncate text-sm font-medium">{spending.name}</p>
        <p className="truncate text-xs text-muted-foreground">
          {spending.group.name} · {formatDate(spending.createdAt)}
        </p>
      </div>
      <span className="shrink-0 font-mono text-sm">{formatMoney(spending.value)}</span>
    </Link>
  )
}

export function LatestsSpendingsSkeleton () {
  return (
    <section className="grid gap-3">
      <Skeleton className="h-3 w-16" />
      <ul className="surface-panel divide-y divide-border">
        {Array.from({ length: 3 }).map((_, i) => (
          <li key={i} className="flex items-center gap-3 px-4 py-3">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-4 w-16" />
          </li>
        ))}
      </ul>
    </section>
  )
}
