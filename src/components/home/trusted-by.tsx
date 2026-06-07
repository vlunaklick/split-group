'use client'

import { useGetMembersTotal } from '@/data/dashboard'
import NumberTicker from '../magicui/number-ticker'

export const TrustedBy = () => {
  const { data, isLoading } = useGetMembersTotal()

  return (
    <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
      <span>
        Más de{' '}
        <span className="font-mono font-medium text-foreground">
          {isLoading ? <NumberTicker value={1} /> : <NumberTicker value={data as number} />}
        </span>{' '}
        personas ya dividen gastos aquí
      </span>
    </p>
  )
}
