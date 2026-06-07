'use client'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetGroupSettlement } from '@/data/spendings'
import { buildSettlementPlanText, shareSettlementPlanOnWhatsApp } from '@/utils/settlement-share'
import { CheckCircle2, MessageCircle, Scale } from 'lucide-react'
import Link from 'next/link'

export function GroupStatusBanner ({ groupId }: { groupId: string }) {
  const { data, isLoading } = useGetGroupSettlement({ groupId })

  if (isLoading) {
    return <Skeleton className="h-16 w-full rounded-lg" />
  }

  if (!data) return null

  const transferCount = data.transferCount ?? 0
  const isSettled = transferCount === 0

  const sharePlan = () => {
    if (!data.transfers?.length) return
    shareSettlementPlanOnWhatsApp(buildSettlementPlanText({
      groupName: data.groupName,
      transferCount: data.transferCount,
      transfers: data.transfers
    }))
  }

  if (isSettled) {
    return (
      <div className="surface-panel flex items-start gap-3 border-success/30 bg-success/5 p-4">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden="true" />
        <div className="grid min-w-0 gap-1">
          <p className="text-sm font-medium">Grupo al día</p>
          <p className="text-sm text-muted-foreground">
            No hay deudas pendientes. Cuando carguen gastos nuevos, acá vas a ver cuántos pagos faltan para cerrar.
          </p>
        </div>
      </div>
    )
  }

  const paymentLabel = transferCount === 1 ? '1 pago' : `${transferCount} pagos`

  return (
    <div className="surface-panel flex flex-col gap-3 border-primary/30 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3 min-w-0">
        <Scale className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
        <div className="grid min-w-0 gap-1">
          <p className="text-sm font-medium">
            Quedan {paymentLabel} para cerrar el grupo
          </p>
          <p className="text-sm text-muted-foreground">
            {data.rawDebtCount > transferCount
              ? `Liquidación simplificada: ${data.rawDebtCount} deudas → ${transferCount} transferencias.`
              : 'Revisá el plan de liquidación y compartilo con el grupo.'}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <Button type="button" variant="outline" size="sm" className="h-9" asChild>
          <Link href="#group-settlement">Ver plan</Link>
        </Button>
        <Button type="button" variant="outline" size="sm" className="h-9" onClick={sharePlan}>
          <MessageCircle className="mr-1.5 h-3.5 w-3.5" />
          WhatsApp
        </Button>
      </div>
    </div>
  )
}
