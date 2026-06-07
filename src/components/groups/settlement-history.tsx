'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { useGetGroupSettlementHistory } from '@/data/spendings'
import { formatShortDate } from '@/lib/dates'
import { formatMoney } from '@/lib/money'
import { cn } from '@/lib/utils'
import { CheckCircle2, ExternalLink, HeartHandshake } from 'lucide-react'

type SettlementHistoryItem = {
  id: string
  amount: number
  status: 'paid' | 'forgiven'
  settledAt: string
  settlementNote?: string | null
  receiptUrl?: string | null
  debterName: string
  creditorName: string
  spendingName: string
  involvesYou: boolean
}

export function SettlementHistory ({ groupId }: { groupId: string }) {
  const { data, isLoading } = useGetGroupSettlementHistory({ groupId })

  if (isLoading) {
    return (
      <div className="grid gap-3">
        <Skeleton className="h-3 w-28" />
        <div className="surface-panel divide-y divide-border">
          <Skeleton className="h-14 w-full rounded-none" />
          <Skeleton className="h-14 w-full rounded-none" />
        </div>
      </div>
    )
  }

  const items = (data ?? []) as SettlementHistoryItem[]

  if (items.length === 0) return null

  return (
    <section className="grid gap-3">
      <h2 className="section-label">Pagos recientes</h2>

      <ul className="surface-panel divide-y divide-border">
        {items.map((item) => (
          <li
            key={item.id}
            className={cn(
              'grid gap-1 px-4 py-3',
              item.involvesYou && 'bg-primary/5'
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {item.debterName}
                  <span className="font-normal text-muted-foreground"> → </span>
                  {item.creditorName}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {item.spendingName}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <span className="font-mono text-sm">{formatMoney(item.amount)}</span>
                <span className={cn(
                  'inline-flex items-center gap-1 text-[11px] font-medium',
                  item.status === 'paid' ? 'text-success' : 'text-muted-foreground'
                )}>
                  {item.status === 'paid'
                    ? (
                      <>
                        <CheckCircle2 className="h-3 w-3" />
                        Pagado
                      </>
                      )
                    : (
                      <>
                        <HeartHandshake className="h-3 w-3" />
                        Perdonado
                      </>
                      )}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground">
              <time dateTime={item.settledAt}>
                {formatShortDate(new Date(item.settledAt))}
              </time>
              {item.settlementNote && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="truncate">{item.settlementNote}</span>
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
                    Ver comprobante
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
