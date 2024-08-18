import { getMembersTotal, getLatestSpendings, getMonthlySpent, getMontlySpentGraph, getTotalDebt, getTotalRevenue, getWeeklySpent } from './actions/dashboard'
import useSWR from 'swr'

export function useGetMembersTotal () {
  return useSWR('members-total', async () => {
    const data = await getMembersTotal()
    return data ?? 0
  })
}

export function useGetLatestSpendings ({ userId }: { userId: string }) {
  return useSWR(['latest-spendings', userId], async ([_, userId]) => {
    const data = await getLatestSpendings({ userId })
    return data ?? []
  })
}

export function useGetMonthlySpent ({ userId }: { userId: string }) {
  return useSWR(['monthly-spent', userId], async ([_, userId]) => {
    const data = await getMonthlySpent({ userId })
    return data ?? { totalSpentThisMonth: 0, totalSpentLastMonth: 0 }
  })
}

export function useGetMontlySpentGraph ({ userId }: { userId: string }) {
  return useSWR(['monthly-spent-graph', userId], async ([_, userId]) => {
    const data = await getMontlySpentGraph({ userId })
    return data ?? []
  })
}

export function useGetTotalDebt ({ userId }: { userId: string }) {
  return useSWR(['total-debt', userId], async ([_, userId]) => {
    const data = await getTotalDebt({ userId })
    return data ?? 0
  })
}

export function useGetTotalRevenue ({ userId }: { userId: string }) {
  return useSWR(['total-revenue', userId], async ([_, userId]) => {
    const data = await getTotalRevenue({ userId })
    return data ?? 0
  })
}

export function useGetWeeklySpent ({ userId }: { userId: string }) {
  return useSWR(['weekly-spent', userId], async ([_, userId]) => {
    const data = await getWeeklySpent({ userId })
    return data ?? 0
  })
}

export function useGetTotalSpent ({ userId }: { userId: string }) {
  return useSWR(['total-spent', userId], async ([_, userId]) => {
    const data = await getMonthlySpent({ userId })
    return data?.totalSpentThisMonth ?? 0
  })
}

export function useGetTotalSpentLastMonth ({ userId }: { userId: string }) {
  return useSWR(['total-spent-last-month', userId], async ([_, userId]) => {
    const data = await getMonthlySpent({ userId })
    return data?.totalSpentLastMonth ?? 0
  })
}
