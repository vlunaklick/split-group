'use client'

import { useGetMembersTotal } from '@/data/dashboard'
import NumberTicker from '../magicui/number-ticker'

export const TrustedBy = () => {
  const { data, isLoading } = useGetMembersTotal()
  const count = data ?? 0

  if (isLoading || count === 0) return null

  return (
    <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
      <span>
        Más de{' '}
        <span className="font-mono font-medium text-foreground">
          <NumberTicker value={count} />
        </span>{' '}
        personas ya dividen gastos aquí
      </span>
    </p>
  )
}
