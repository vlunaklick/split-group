import useSWR from 'swr'

export function useGetSession () {
  return useSWR('session', async () => {
    const res = await fetch('/api/auth/session')
    if (!res.ok) return null
    return res.json()
  })
}
