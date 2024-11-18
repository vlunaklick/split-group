import useSWR from 'swr'

export function useGetMembersTotal () {
  return useSWR('members-total', async () => {
    const data = await fetch('/api/users/members').then((res) => res.json())
    return data ?? 0
  })
}

export function useGetMontlySpentGraph () {
  return useSWR(['monthly-spent-graph'], async ([_]) => {
    const data = await fetch('/api/users/stats').then((res) => res.json())

    return data ?? []
  })
}

export function useGetTotalRevenue () {
  return useSWR(['total-revenue'], async ([_]) => {
    const data = await fetch('/api/users?total-revenue=true').then((res) => res.json())

    return data ?? []
  })
}

export function useGetTotalDebt () {
  return useSWR(['total-debt'], async ([_]) => {
    const data = await fetch('/api/users?total-debt=true').then((res) => res.json())

    return data ?? []
  })
}

export function useGetMonthlySpent () {
  return useSWR(['monthly-spent'], async ([_]) => {
    const data = await fetch('/api/users?monthly-spent=true').then((res) => res.json())

    return data ?? []
  })
}

export function useGetWeeklySpent () {
  return useSWR(['weekly-spent'], async ([_]) => {
    const data = await fetch('/api/users?weekly-spent=true').then((res) => res.json())

    return data ?? []
  })
}
