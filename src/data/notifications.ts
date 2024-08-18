import useSWR from 'swr'
import { getGroupNotifications, getNotifications, getAmountNotifications } from './actions/notifications'

export function useGetNotifications ({ userId }: { userId: string }) {
  return useSWR(['notifications', userId], async ([_, userId]) => {
    return await getNotifications(userId)
  })
}

export function useGetGroupNotifications ({ userId }: { userId: string }) {
  return useSWR(['group-notifications', userId], async ([_, userId]) => {
    return await getGroupNotifications(userId)
  })
}

export function useGetAmountNotifications ({ userId }: { userId: string }) {
  return useSWR(['amount-notifications', userId], async ([_, userId]) => {
    return await getAmountNotifications(userId)
  })
}