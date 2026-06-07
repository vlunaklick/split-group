'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { useGetTotalDebt, useGetTotalRevenue } from '@/data/dashboard'
import { useGetDolarValue } from '@/data/money'
import { formatMoney } from '@/lib/money'
import { cn } from '@/lib/utils'

function StatBlock ({
  label,
  value,
  hint,
  tone
}: {
  label: string
  value: string
  hint?: string
  tone?: 'negative' | 'positive'
}) {
  return (
    <div className="space-y-1 p-5">
      <p className="section-label">{label}</p>
      <p className={cn(
        'font-mono text-2xl tracking-tight',
        tone === 'negative' && 'text-destructive',
        tone === 'positive' && 'text-success'
      )}>
        {value}
      </p>
      {hint && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  )
}

export const TotalDebt = () => {
  const { data, isLoading } = useGetTotalDebt()
  const { data: dolarValue } = useGetDolarValue()
  const currency = localStorage.getItem('currency') ?? 'Peso Argentino'

  const total = (currency === 'Peso Argentino'
    ? data?.totalDebt
    : (data?.totalDebt / dolarValue?.compra)) ?? 0

  if (isLoading) return <StatBlockSkeleton />

  return (
    <StatBlock
      label="Debés"
      value={formatMoney(total)}
      hint="Pendiente en todos tus grupos"
      tone="negative"
    />
  )
}

export const TotalRevenue = () => {
  const { data, isLoading } = useGetTotalRevenue()
  const { data: dolarValue } = useGetDolarValue()
  const currency = localStorage.getItem('currency') ?? 'Peso Argentino'

  const total = (currency === 'Peso Argentino'
    ? data?.totalRevenue
    : (data?.totalRevenue / dolarValue?.compra)) ?? 0

  if (isLoading) return <StatBlockSkeleton />

  return (
    <StatBlock
      label="Te deben"
      value={formatMoney(total)}
      hint="Por cobrar en todos tus grupos"
      tone="positive"
    />
  )
}

function StatBlockSkeleton () {
  return (
    <div className="space-y-2 p-5">
      <Skeleton className="h-3 w-12" />
      <Skeleton className="h-8 w-24" />
    </div>
  )
}

export const StatCardSkeleton = StatBlockSkeleton
