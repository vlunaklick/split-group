'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetMonthlySpent, useGetTotalDebt, useGetTotalRevenue, useGetWeeklySpent } from '@/data/dashboard'
import { useGetDolarValue } from '@/data/money'
import { formatMoney } from '@/lib/money'
import { IconCashBanknote, IconMoneybag, IconTransferIn, IconTransferOut } from '@tabler/icons-react'

export const WeeklySpent = () => {
  const { data: defaultData, isLoading } = useGetWeeklySpent()

  const totalSpentLastWeek = defaultData?.totalSpentLastWeek ?? 0
  const totalSpentThisWeek = defaultData?.totalSpentThisWeek ?? 0

  const percentageDifference = totalSpentLastWeek !== 0
    ? ((totalSpentThisWeek - totalSpentLastWeek) / totalSpentLastWeek) * 100
    : totalSpentThisWeek > 0
      ? 100
      : 0

  const { data: dolarValue } = useGetDolarValue()

  const currency = localStorage.getItem('currency') ?? 'Peso Argentino'

  const total = (currency === 'Peso Argentino'
    ? defaultData?.totalSpentThisWeek
    : (defaultData?.totalSpentThisWeek / dolarValue?.compra)) ??
    0

  const value = formatMoney(total)

  if (isLoading) {
    return <StatCardSkeleton />
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Gasto semanal</CardTitle>
        <IconCashBanknote className="h-4 w-4 text-muted-foreground/60" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground/60">
          {percentageDifference > 0 ? '+' : ''}{percentageDifference.toFixed(1)}% desde la semana pasada
        </p>
      </CardContent>
    </Card>
  )
}

export const MonthlySpent = () => {
  const { data: defaultData = { totalSpentThisMonth: 0, totalSpentLastMonth: 0 }, isLoading } = useGetMonthlySpent()

  const totalSpentLastMonth = defaultData?.totalSpentLastMonth ?? 0
  const totalSpentThisMonth = defaultData?.totalSpentThisMonth ?? 0

  const percentageDifference = totalSpentLastMonth !== 0
    ? ((totalSpentThisMonth - totalSpentLastMonth) / totalSpentLastMonth) * 100
    : totalSpentThisMonth > 0
      ? 100
      : 0

  const { data: dolarValue } = useGetDolarValue()

  const currency = localStorage.getItem('currency') ?? 'Peso Argentino'

  const total = (currency === 'Peso Argentino'
    ? defaultData?.totalSpentThisMonth
    : (defaultData?.totalSpentThisMonth / dolarValue?.compra)) ??
    0

  const value = formatMoney(total)

  if (isLoading) {
    return <StatCardSkeleton />
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Gasto mensual</CardTitle>
        <IconMoneybag className="h-4 w-4 text-muted-foreground/60" />
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground/60">
          {percentageDifference > 0 ? '+' : ''}{percentageDifference.toFixed(1)}% desde el mes pasado
        </p>
      </CardContent>
    </Card>
  )
}

export const TotalDebt = () => {
  const { data, isLoading } = useGetTotalDebt()

  const { data: dolarValue } = useGetDolarValue()

  const currency = localStorage.getItem('currency') ?? 'Peso Argentino'

  const total = (currency === 'Peso Argentino'
    ? data?.totalDebt
    : (data?.totalDebt / dolarValue?.compra)) ??
    0

  const value = formatMoney(total)

  if (isLoading) {
    return <StatCardSkeleton />
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Deuda total</CardTitle>
        <IconTransferOut className="h-4 w-4 text-muted-foreground/60" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground/60">Valor entre todos los grupos</p>
      </CardContent>
    </Card>
  )
}

export const TotalRevenue = () => {
  const { data, isLoading } = useGetTotalRevenue()

  const { data: dolarValue } = useGetDolarValue()

  const currency = localStorage.getItem('currency') ?? 'Peso Argentino'

  const total = (currency === 'Peso Argentino'
    ? data?.totalRevenue
    : (data?.totalRevenue / dolarValue?.compra)) ??
    0

  const value = formatMoney(total)

  if (isLoading) {
    return <StatCardSkeleton />
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total a cobrar</CardTitle>
        <IconTransferIn className="h-4 w-4 text-muted-foreground/60" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground/60">Valor entre todos los grupos</p>
      </CardContent>
    </Card>
  )
}

export const StatCardSkeleton = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-4" />
        <IconCashBanknote className="h-4 w-4 text-muted-foreground/60" />
      </CardHeader>
      <CardContent>
        <div className="animate-pulse space-y-1">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-3 w-20" />
        </div>
      </CardContent>
    </Card>
  )
}
