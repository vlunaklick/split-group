import useSWR from 'swr'

export function useGetUserByUsername ({ username }: { username: string }) {
  return useSWR(['user', username], async ([, username]) => {
    return await fetch(`/api/users/${username}`).then(res => res.json())
  })
}
