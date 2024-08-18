'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetSpendingById } from '@/data/spendings'
import { formatDate } from '@/lib/dates'
import { formatMoney } from '@/lib/money'

export const SpendInfo = ({ groupId, spendId, userId }: { groupId: string, spendId: string, userId: string }) => {
  const { data, isLoading } = useGetSpendingById({ spendingId: spendId })

  if (isLoading) return <div>Loading...</div>
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
          <p className='text-muted-foreground/80'>Descripción:</p>
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
