import useSWR from 'swr'

export function useGetRecurringSpendings ({ groupId }: { groupId: string }) {
  return useSWR(['recurring-spendings', groupId], async ([, groupId]) => {
    const { listRecurringSpendings } = await import('@/app/(overview)/groups/[groupId]/spendings/recurring-actions')
    return listRecurringSpendings({ groupId })
  })
}

export function useGetGroupActivity ({ groupId, limit = 12 }: { groupId: string, limit?: number }) {
  return useSWR(['group-activity', groupId, limit], async ([, groupId, limit]) => {
    return await fetch(`/api/groups/${groupId}/activity?limit=${limit}`).then(res => res.json())
  })
}
