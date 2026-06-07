import useSWR from 'swr'

export function useGetUserOnboarding () {
  return useSWR('user-onboarding', async () => {
    return await fetch('/api/users/onboarding').then(res => res.json())
  })
}

export function useGetGroupOnboarding ({ groupId }: { groupId: string }) {
  return useSWR(['group-onboarding', groupId], async ([, groupId]) => {
    return await fetch(`/api/users/onboarding?groupId=${groupId}`).then(res => res.json())
  })
}
