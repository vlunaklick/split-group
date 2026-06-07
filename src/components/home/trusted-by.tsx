'use client'

import { useGetMembersTotal } from '@/data/dashboard'
import NumberTicker from '../magicui/number-ticker'

export const TrustedBy = () => {
  const { data, isLoading } = useGetMembersTotal()

  return (
    <div className="flex flex-row items-center gap-2 text-sm text-muted-foreground">
      <span>Miembros totales:</span>
      <span className="font-mono text-foreground">
        {isLoading ? <NumberTicker value={1} /> : <NumberTicker value={data as number} />}
      </span>
    </div>
  )
}
