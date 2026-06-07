import useSWR from 'swr'

export function useGetNotifications () {
  return useSWR(['notifications'], async ([_]) => {
    return await fetch('/api/notifications').then(res => res.json())
  })
}

export function useGetGroupNotifications () {
  return useSWR(['group-notifications'], async ([_]) => {
    return await fetch('/api/notifications?group=true').then(res => res.json())
  })
}

export const useGetAmountNotifications = useGetNotifications
