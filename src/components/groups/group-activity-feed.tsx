'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { useGetGroupActivity } from '@/data/recurring-spendings'
import { formatShortDate } from '@/lib/dates'
import { formatMoney } from '@/lib/money'
import { cn } from '@/lib/utils'
import { CheckCircle2, ExternalLink, HeartHandshake, Receipt } from 'lucide-react'
import Link from 'next/link'

type ActivityItem = {
  id: string
  type: 'spending' | 'payment' | 'forgiven'
  at: string
  actorName: string
  title: string
  subtitle?: string
  amount?: number
  receiptUrl?: string | null
  spendingId?: string
}

const iconForType = {
  spending: Receipt,
  payment: CheckCircle2,
  forgiven: HeartHandshake
}

export function GroupActivityFeed ({ groupId }: { groupId: string }) {
  const { data, isLoading } = useGetGroupActivity({ groupId })

  if (isLoading) {
    return (
      <section className="grid gap-3">
        <Skeleton className="h-3 w-24" />
        <div className="surface-panel divide-y divide-border">
          <Skeleton className="h-14 w-full rounded-none" />
          <Skeleton className="h-14 w-full rounded-none" />
        </div>
      </section>
    )
  }

  const items = (data ?? []) as ActivityItem[]

  if (items.length === 0) return null

  return (
    <section className="grid gap-3">
      <h2 className="section-label">Actividad reciente</h2>

      <ul className="surface-panel divide-y divide-border">
        {items.map((item) => {
          const Icon = iconForType[item.type]

          return (
            <li key={item.id} className="flex items-start gap-3 px-4 py-3">
              <div className={cn(
                'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                item.type === 'spending' && 'bg-muted text-muted-foreground',
                item.type === 'payment' && 'bg-success/10 text-success',
                item.type === 'forgiven' && 'bg-muted text-muted-foreground'
              )}>
                <Icon className="h-4 w-4" aria-hidden="true" />
              </div>

              <div className="min-w-0 flex-1 grid gap-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{item.title}</p>
                    {item.subtitle && (
                      <p className="truncate text-xs text-muted-foreground">{item.subtitle}</p>
                    )}
                  </div>
                  {typeof item.amount === 'number' && (
                    <span className="shrink-0 font-mono text-sm">{formatMoney(item.amount)}</span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground">
                  <time dateTime={item.at}>{formatShortDate(new Date(item.at))}</time>
                  <span aria-hidden="true">·</span>
                  <span>{item.actorName}</span>
                  {item.spendingId && (
                    <>
                      <span aria-hidden="true">·</span>
                      <Link
                        href={`/groups/${groupId}/spendings/${item.spendingId}`}
                        className="font-medium text-foreground hover:underline"
                      >
                        Ver gasto
                      </Link>
                    </>
                  )}
                  {item.receiptUrl && (
                    <>
                      <span aria-hidden="true">·</span>
                      <a
                        href={item.receiptUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-medium text-foreground hover:underline"
                      >
                        Comprobante
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </>
                  )}
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
