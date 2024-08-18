import useSWR from 'swr'
import { getDebts, getLastSpendings, getSpendingsTable, getPayers, getParticipants, getSpending, getCurrentDebts, getOwedDebts } from './actions/spendings'

export function useGetDebts ({ groupId, userId }: { groupId: string, userId: string }) {
  return useSWR(['debts', groupId, userId], async ([, groupId, userId]) => {
    return await getDebts({ groupId, userId })
  })
}

export function useGetLastSpendings ({ groupId }: { groupId: string }) {
  return useSWR(['last-spendings', groupId], async ([, groupId]) => {
    return await getLastSpendings(groupId)
  })
}

export function useGetSpendingsTable ({ groupId, userId }: { groupId: string, userId: string }) {
  return useSWR(['spendings-table', groupId, userId], async ([, groupId, userId]) => {
    return await getSpendingsTable({ groupId, userId })
  })
}

export function useGetPayers ({ groupId, spendId }: { groupId: string, spendId: string }) {
  return useSWR(['payers', groupId, spendId], async ([, groupId, spendId]) => {
    return await getPayers({ groupId, spendId })
  })
}

export function useGetSpendingParticipants ({ groupId, spendId }: { groupId: string, spendId: string }) {
  return useSWR(['spending-participants', groupId, spendId], async ([, groupId, spendId]) => {
    return await getParticipants({ groupId, spendId })
  })
}

export function useGetSpendingById ({ spendingId }: { spendingId: string }) {
  return useSWR(['spending', spendingId], async ([, spendingId]) => {
    return await getSpending({ spendingId })
  })
}

export function useGetCurrentDebts ({ groupId, userId, spendId }: { groupId: string, userId: string, spendId: string }) {
  return useSWR(['current-debts', groupId, userId, spendId], async ([, groupId, userId, spendId]) => {
    return await getCurrentDebts({ groupId, userId, spendId })
  })
}

export function useGetOwedDebts ({ groupId, userId, spendId }: { groupId: string, userId: string, spendId: string }) {
  return useSWR(['owed-debts', groupId, userId, spendId], async ([, groupId, userId, spendId]) => {
    return await getOwedDebts({ groupId, userId, spendId })
  })
}
