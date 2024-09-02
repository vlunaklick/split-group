import { GetSpendingsSchema } from '@/lib/validations'
import useSWR from 'swr'

export function useGetDebts ({ groupId }: { groupId: string }) {
  return useSWR(['debts', groupId], async ([, groupId]) => {
    return await fetch(`/api/groups/${groupId}/spendings?getGroupDebts=true`).then(res => res.json())
  })
}

export function useGetLastSpendings ({ groupId }: { groupId: string }) {
  return useSWR(['last-spendings', groupId], async ([, groupId]) => {
    return await fetch(`/api/groups/${groupId}/spendings?getLatestGroupSpendings=true`).then(res => res.json())
  })
}

export function useGetSpendingsTable ({ groupId, searchParams }: { groupId: string, searchParams: GetSpendingsSchema }) {
  return useSWR(['spendings-table', groupId], async ([, groupId]) => {
    const urlSearchParams = new URLSearchParams(searchParams as Record<string, string>).toString()

    return await fetch(`/api/groups/${groupId}/spendings?getSpendingsTable=true&${urlSearchParams}`).then(res => res.json())
  })
}

export function useGetPayers ({ groupId, spendId }: { groupId: string, spendId: string }) {
  return useSWR(['payers', groupId, spendId], async ([, groupId, spendId]) => {
    return await fetch(`/api/groups/${groupId}/spendings/${spendId}?getSpendingPayers=true`).then(res => res.json())
  })
}

export function useGetSpendingParticipants ({ groupId, spendId }: { groupId: string, spendId: string }) {
  return useSWR(['spending-participants', groupId, spendId], async ([, groupId, spendId]) => {
    return await fetch(`/api/groups/${groupId}/spendings/${spendId}?getSpendingParticipants=true`).then(res => res.json())
  })
}

export function useGetSpendingById ({ spendingId }: { spendingId: string }) {
  return useSWR(['spending', spendingId], async ([, spendingId]) => {
    return await fetch(`/api/spendings/${spendingId}?getSpendingById=true`).then(res => res.json())
  })
}

export function useGetCurrentDebts ({ groupId, spendId }: { groupId: string, spendId: string }) {
  return useSWR(['current-debts', groupId, spendId], async ([, groupId, spendId]) => {
    return await fetch(`/api/groups/${groupId}/spendings/${spendId}?getSpendingDebts=true`).then(res => res.json())
  })
}

export function useGetOwedDebts ({ groupId, spendId }: { groupId: string, spendId: string }) {
  return useSWR(['owed-debts', groupId, spendId], async ([, groupId, spendId]) => {
    return await fetch(`/api/groups/${groupId}/spendings/${spendId}?getSpendingOwedDebts=true`).then(res => res.json())
  })
}

export function useGetSpendingComments ({ spendingId }: { spendingId: string }) {
  return useSWR(['spending-comments', spendingId], async ([, spendingId]) => {
    return await fetch(`/api/spendings/${spendingId}?getSpendingComments=true`).then(res => res.json())
  })
}
