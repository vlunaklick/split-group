'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatMoney } from '@/lib/money'
import useSWR from 'swr'
import { getMonthlySpent, getTotalDebt, getTotalRevenue, getWeeklySpent } from './actions'
import { IconTransferIn, IconTransferOut, IconMoneybag, IconCashBanknote } from '@tabler/icons-react'

export const WeeklySpent = ({ userId }: { userId: string }) => {
  const { data, isLoading } = useSWR(['getWeeklySpent', userId], async ([_, userId]) => await getWeeklySpent({ userId }))

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
        <CardTitle className="text-sm font-medium">Esta semana</CardTitle>
        <IconCashBanknote className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
      </CardHeader>
      <CardContent>
        {
          isLoading
            ? <CardSkeleton />
            : (
              <>
                <div className="text-2xl font-bold">{formatMoney(data?.totalSpentThisWeek ?? 0)}</div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
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
  const { data, isLoading } = useSWR(['getMonthlySpent', userId], async ([_, userId]) => await getMonthlySpent({ userId }))

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
        <IconMoneybag className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
      </CardHeader>
      <CardContent>
        {
          isLoading
            ? <CardSkeleton />
            : (
              <>
                <div className="text-2xl font-bold">{formatMoney(data?.totalSpentThisMonth ?? 0)}</div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
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
  const { data, isLoading } = useSWR(['getTotalDebt', userId], async ([_, userId]) => await getTotalDebt({ userId }))

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Deuda total</CardTitle>
        <IconTransferOut className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
      </CardHeader>
      <CardContent>
        {
          isLoading
            ? <Skeleton className="h-8 w-20" />
            : <div className="text-2xl font-bold">{formatMoney(data?.totalDebt ?? 0)}</div>
        }
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Valor entre todos los grupos</p>
      </CardContent>
    </Card>
  )
}

export const TotalRevenue = ({ userId }: { userId: string }) => {
  const { data, isLoading } = useSWR(['getTotalRevenue', userId], async ([_, userId]) => await getTotalRevenue({ userId }))

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total a cobrar</CardTitle>
        <IconTransferIn className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
      </CardHeader>
      <CardContent>
        {
          isLoading
            ? <Skeleton className="h-8 w-20" />
            : <div className="text-2xl font-bold">{formatMoney(data?.totalRevenue ?? 0)}</div>
        }
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Valor entre todos los grupos</p>
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
