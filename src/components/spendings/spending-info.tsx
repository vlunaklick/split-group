'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetSpendingById } from '@/data/spendings'
import { formatDate } from '@/lib/dates'
import { formatMoney } from '@/lib/money'
import { Skeleton } from '@/components/ui/skeleton'

export const SpendingInfo = ({ spendId }: { spendId: string }) => {
  const { data, isLoading } = useGetSpendingById({ spendingId: spendId })

  if (isLoading) return <SpendInfoSkeleton />
  if (!data) return <div>Failed to load</div>

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Gasto</CardTitle>
        <CardDescription>
          Información general del gasto
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4 text-sm'>
        <div>
          <p className='text-muted-foreground/80 text-xs'>Nombre:</p>
          <p>{data.name}</p>
        </div>

        <div>
          <p className='text-muted-foreground/80 text-xs'>Descripción:</p>
          <p>{data.description}</p>
        </div>

        <div>
          <p className='text-muted-foreground/80 text-xs'>Creado por:</p>
          <p>{data.owner?.name}</p>
        </div>

        <div>
          <p className='text-muted-foreground/80 text-xs'>Categoría:</p>
          <p>{data.category?.name}</p>
        </div>

        <div>
          <p className='text-muted-foreground/80 text-xs'>Fecha:</p>
          <p>{formatDate(data.date)}</p>
        </div>

        <div className='flex gap-4 justify-between'>
          <div>
            <p className='text-muted-foreground/80 text-xs'>Monto:</p>
            <p>{formatMoney(data.value)}</p>
          </div>
          <div>
            <p className='text-muted-foreground/80 text-xs'>Moneda:</p>
            <p>{data.currency.name}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export const SpendInfoSkeleton = () => {
  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Gasto</CardTitle>
        <CardDescription>
          Información general del gasto
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4 text-sm'>
        <div>
          <p className='text-muted-foreground/80 text-xs'>Nombre:</p>
          <Skeleton className='w-36 h-5' />
        </div>

        <div>
          <p className='text-muted-foreground/80 text-xs'>Descripción:</p>
          <Skeleton className='w-64 h-5' />
        </div>

        <div>
          <p className='text-muted-foreground/80 text-xs'>Creado por:</p>
          <Skeleton className='w-24 h-5' />
        </div>

        <div>
          <p className='text-muted-foreground/80 text-xs'>Categoría:</p>
          <Skeleton className='w-24 h-5' />
        </div>

        <div>
          <p className='text-muted-foreground/80 text-xs'>Fecha:</p>
          <Skeleton className='w-24 h-5' />
        </div>

        <div className='flex gap-4 justify-between'>
          <div>
            <p className='text-muted-foreground/80 text-xs'>Monto:</p>
            <Skeleton className='w-24 h-5' />
          </div>
          <div>
            <p className='text-muted-foreground/80 text-xs'>Moneda:</p>
            <Skeleton className='w-12 h-5' />
          </div>
          </div>
      </CardContent>
    </Card>
  )
}
