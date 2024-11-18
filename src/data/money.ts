import useSWR from 'swr'

export function useGetDolarValue () {
  return useSWR('dolar-value', async () => {
    return await fetch('/api/users?dolar=true').then(res => res.json())
  })
}
