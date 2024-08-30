import { getMembersTotal, getLatestSpendings, getMonthlySpent, getMontlySpentGraph, getTotalDebt, getTotalRevenue, getWeeklySpent } from './actions/dashboard'
import useSWR from 'swr'

export function useGetMembersTotal () {
  return useSWR('members-total', async () => {
    const data = await getMembersTotal()
    return data ?? 0
  })
}

export function useGetLatestSpendings () {
  return useSWR(['latest-spendings'], async ([_]) => {
    const data = await getLatestSpendings()
    return data ?? []
  })
}

export function useGetMonthlySpent () {
  return useSWR(['monthly-spent'], async ([_]) => {
    const data = await getMonthlySpent()
    return data ?? { totalSpentThisMonth: 0, totalSpentLastMonth: 0 }
  })
}

export function useGetMontlySpentGraph () {
  return useSWR(['monthly-spent-graph'], async ([_]) => {
    const data = await getMontlySpentGraph()

    return data ?? []
  })
}

export function useGetTotalDebt () {
  return useSWR(['total-debt'], async ([_]) => {
    const data = await getTotalDebt()
    return data ?? 0
  })
}

export function useGetTotalRevenue () {
  return useSWR(['total-revenue'], async ([_]) => {
    const data = await getTotalRevenue()
    return data ?? 0
  })
}

export function useGetWeeklySpent () {
  return useSWR(['weekly-spent'], async ([_]) => {
    const data = await getWeeklySpent()
    return data ?? 0
  })
}

export function useGetTotalSpent () {
  return useSWR(['total-spent'], async ([_]) => {
    const data = await getMonthlySpent()
    return data?.totalSpentThisMonth ?? 0
  })
}

export function useGetTotalSpentLastMonth () {
  return useSWR(['total-spent-last-month'], async ([_]) => {
    const data = await getMonthlySpent()
    return data?.totalSpentLastMonth ?? 0
  })
}
