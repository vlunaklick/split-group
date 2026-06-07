'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { useGetGroupSettlement } from '@/data/spendings'
import { useGetSession } from '@/data/session'
import { formatMoney } from '@/lib/money'
import { cn } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'

export function SettlementPlan ({ groupId }: { groupId: string }) {
  const { data, isLoading } = useGetGroupSettlement({ groupId })
  const { data: session } = useGetSession()
  const userId = session?.user?.id

  if (isLoading) {
    return (
      <div className="surface-panel grid gap-3 p-4">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  if (!data?.transfers?.length) return null

  const savings = data.rawDebtCount - data.transferCount
  const userTransfers = data.transfers.filter(
    (t: { fromId: string, toId: string }) => t.fromId === userId || t.toId === userId
  )

  return (
    <section className="grid gap-3">
      <div className="grid gap-1">
        <h2 className="section-label">Liquidación simplificada</h2>
        <p className="text-xs text-muted-foreground">
          {data.transferCount} {data.transferCount === 1 ? 'pago' : 'pagos'} cierran el grupo
          {savings > 0 && ` (en vez de ${data.rawDebtCount} deudas sueltas)`}
        </p>
      </div>

      <ul className="surface-panel divide-y divide-border">
        {data.transfers.map((transfer: {
          fromId: string
          fromName: string
          toId: string
          toName: string
          amount: number
        }) => {
          const involvesUser = transfer.fromId === userId || transfer.toId === userId

          return (
            <li
              key={`${transfer.fromId}-${transfer.toId}-${transfer.amount}`}
              className={cn(
                'flex items-center gap-3 px-4 py-3 text-sm',
                involvesUser && 'bg-primary/5'
              )}
            >
              <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1">
                <span className={cn('font-medium', transfer.fromId === userId && 'text-destructive')}>
                  {transfer.fromName}
                  {transfer.fromId === userId && ' (vos)'}
                </span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span className={cn('font-medium', transfer.toId === userId && 'text-success')}>
                  {transfer.toName}
                  {transfer.toId === userId && ' (vos)'}
                </span>
              </div>
              <span className="shrink-0 font-mono text-sm">{formatMoney(transfer.amount)}</span>
            </li>
          )
        })}
      </ul>

      {userId && userTransfers.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {userTransfers.length === 1
            ? 'Tenés 1 movimiento en este plan.'
            : `Tenés ${userTransfers.length} movimientos en este plan.`}
          {' '}Usá la lista de abajo para marcar pagado o perdonar.
        </p>
      )}
    </section>
  )
}
