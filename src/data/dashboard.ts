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
