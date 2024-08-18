'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetMonthlySpent, useGetTotalDebt, useGetTotalRevenue, useGetWeeklySpent } from '@/data/dashboard'
import { formatMoney } from '@/lib/money'
import { IconCashBanknote, IconMoneybag, IconTransferIn, IconTransferOut } from '@tabler/icons-react'

export const WeeklySpent = ({ userId }: { userId: string }) => {
  const { data, isLoading } = useGetWeeklySpent({ userId })

  const totalSpentLastWeek = data?.totalSpentLastWeek ?? 0
  const totalSpentThisWeek = data?.totalSpentThisWeek ?? 0

  const percentageDifference = totalSpentLastWeek !== 0
    ? ((totalSpentThisWeek - totalSpentLastWeek) / totalSpentLastWeek) * 100
    : totalSpentThisWeek > 0
      ? 100
      : 0

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Gasto semanal</CardTitle>
        <IconCashBanknote className="h-4 w-4 text-muted-foreground/60" />
      </CardHeader>
      <CardContent>
        {
          isLoading
            ? <CardSkeleton />
            : (
              <>
                <div className="text-2xl font-bold">{formatMoney(data?.totalSpentThisWeek ?? 0)}</div>
                <p className="text-xs text-muted-foreground/60">
                  {percentageDifference > 0 ? '+' : ''}{percentageDifference.toFixed(1)}% desde la semana pasada
                </p>
              </>
              )
        }
      </CardContent>
    </Card>
  )
}

export const MonthlySpent = ({ userId }: { userId: string }) => {
  const { data, isLoading } = useGetMonthlySpent({ userId })

  const totalSpentLastMonth = data?.totalSpentLastMonth ?? 0
  const totalSpentThisMonth = data?.totalSpentThisMonth ?? 0

  const percentageDifference = totalSpentLastMonth !== 0
    ? ((totalSpentThisMonth - totalSpentLastMonth) / totalSpentLastMonth) * 100
    : totalSpentThisMonth > 0
      ? 100
      : 0

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Gasto mensual</CardTitle>
        <IconMoneybag className="h-4 w-4 text-muted-foreground/60" />
      </CardHeader>
      <CardContent>
        {
          isLoading
            ? <CardSkeleton />
            : (
              <>
                <div className="text-2xl font-bold">{formatMoney(data?.totalSpentThisMonth ?? 0)}</div>
                <p className="text-xs text-muted-foreground/60">
                  {percentageDifference > 0 ? '+' : ''}{percentageDifference.toFixed(1)}% desde el mes pasado
                </p>
              </>
              )
        }
      </CardContent>
    </Card>
  )
}

export const TotalDebt = ({ userId }: { userId: string }) => {
  const { data, isLoading } = useGetTotalDebt({ userId })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Deuda total</CardTitle>
        <IconTransferOut className="h-4 w-4 text-muted-foreground/60" />
      </CardHeader>
      <CardContent>
        {
          isLoading
            ? <Skeleton className="h-8 w-20" />
            : <div className="text-2xl font-bold">{formatMoney(data?.totalDebt ?? 0)}</div>
        }
        <p className="text-xs text-muted-foreground/60">Valor entre todos los grupos</p>
      </CardContent>
    </Card>
  )
}

export const TotalRevenue = ({ userId }: { userId: string }) => {
  const { data, isLoading } = useGetTotalRevenue({ userId })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total a cobrar</CardTitle>
        <IconTransferIn className="h-4 w-4 text-muted-foreground/60" />
      </CardHeader>
      <CardContent>
        {
          isLoading
            ? <Skeleton className="h-8 w-20" />
            : <div className="text-2xl font-bold">{formatMoney(data?.totalRevenue ?? 0)}</div>
        }
        <p className="text-xs text-muted-foreground/60">Valor entre todos los grupos</p>
      </CardContent>
    </Card>
  )
}

const CardSkeleton = () => {
  return (
    <div className="animate-pulse space-y-1">
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-3 w-20" />
    </div>
  )
}
