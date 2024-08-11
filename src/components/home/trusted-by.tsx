'use client'

import useSWR from 'swr'
import NumberTicker from '../magicui/number-ticker'
import { getMembersTotal } from './actions'

export const TrustedBy = () => {
  const { data, isLoading } = useSWR('members-total', async () => {
    const data = await getMembersTotal()
    return data ?? 0
  })

  return (
    <div className="flex max-w-xl flex-row items-center justify-between text-balance p-5 text-left text-base tracking-tight md:text-center md:text-base dark:font-medium text-primary">
      <span className="mr-2 font-300 text-muted-foreground/60 text-md">
        Miembros totales:
      </span>
      {isLoading && <NumberTicker value={1} />}
      {!isLoading && <NumberTicker value={data as number} />}
    </div>
  )
}
