'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetSpendingById } from '@/data/spendings'
import { formatDate } from '@/lib/dates'
import { formatMoney } from '@/lib/money'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

export const SpendingInfo = ({ spendId, compact = false }: { spendId: string, compact?: boolean }) => {
  const { data, isLoading } = useGetSpendingById({ spendingId: spendId })

  if (isLoading) return <SpendInfoSkeleton compact={compact} />
  if (!data) return <div className="text-sm text-muted-foreground">No se pudo cargar el gasto</div>

  const hasDescription = Boolean(data.description?.trim())

  return (
    <Card className="w-full">
      {!compact && (
        <CardHeader>
          <CardTitle>{data.name}</CardTitle>
          <CardDescription>Detalle del gasto</CardDescription>
        </CardHeader>
      )}
      <CardContent className={cn('space-y-3 text-sm', compact && 'pt-6')}>
        {compact && (
          <div>
            <p className="text-xs text-muted-foreground">Detalle</p>
            <p className="font-medium">Información del gasto</p>
          </div>
        )}

        <InfoRow label="Categoría" value={data.category?.name} />
        <InfoRow label="Registrado por" value={data.owner?.name} />
        <InfoRow label="Fecha" value={formatDate(data.date)} />
        {!compact && <InfoRow label="Monto" value={formatMoney(data.value)} mono />}
        <InfoRow label="Moneda" value={data.currency?.name} />

        {hasDescription && (
          <InfoRow label="Nota" value={data.description} />
        )}
      </CardContent>
    </Card>
  )
}

function InfoRow ({ label, value, mono }: { label: string, value?: string | null, mono?: boolean }) {
  if (!value) return null
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={mono ? 'font-mono font-medium' : undefined}>{value}</p>
    </div>
  )
}

export const SpendInfoSkeleton = ({ compact = false }: { compact?: boolean }) => {
  return (
    <Card className="w-full">
      {!compact && (
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-24" />
        </CardHeader>
      )}
      <CardContent className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="mb-1 h-3 w-16" />
            <Skeleton className="h-5 w-28" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
