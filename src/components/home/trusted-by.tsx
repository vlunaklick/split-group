'use client'

import { useGetMembersTotal } from '@/data/dashboard'
import NumberTicker from '../magicui/number-ticker'

export const TrustedBy = () => {
  const { data, isLoading } = useGetMembersTotal()

  return (
    <div className="flex max-w-xl flex-row items-center justify-between text-balance p-5 text-left text-base tracking-tight md:text-center md:text-base text-primary">
      <span className="mr-2 font-300 text-muted-foreground/60 text-md">
        Miembros totales:
      </span>
      {isLoading && <NumberTicker value={1} />}
      {!isLoading && <NumberTicker value={data as number} />}
    </div>
  )
}
