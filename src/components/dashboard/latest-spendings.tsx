import { SpendingIcon } from '@/components/spending-icons'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate } from '@/lib/dates'
import { formatMoney } from '@/lib/money'
import { cn } from '@/lib/utils'
import { SpendingWithOwnerAndGroup } from '../../app/(overview)/dashboard/types'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getLatestSpendings } from '@/data/actions/dashboard'

export const LatestsSpendings = async () => {
  const session = await getServerSession(authOptions)
  const latestSpendings = await getLatestSpendings({ userId: session?.user.id as string })

  return (
    <Card className='xl:col-span-2 h-min'>
      <CardHeader>
        <CardTitle>Últimos gastos</CardTitle>
        <CardDescription>
          Gastos registrados en los últimos 30 días
        </CardDescription>
      </CardHeader>
      <CardContent>
        {latestSpendings?.length === 0 && (
          <p className="text-sm text-muted-foreground/50">No hay gastos registrados</p>
        )}

        {latestSpendings && latestSpendings?.length > 0 && (
          <div className="grid gap-4">
            {latestSpendings?.map(spending => (
              <SpendingItem key={spending.id} spending={spending} />
            ))}
          </div>
        )}

      </CardContent>
    </Card>
  )
}

const SpendingItem = ({ spending }: { spending: SpendingWithOwnerAndGroup }) => {
  return (
    <div className="flex items-center gap-4">
      <div className={cn(buttonVariants({ variant: 'secondary', size: 'icon' }), 'rounded-full')}>
        <SpendingIcon type={spending.category.name as 'Comida' | 'Transporte' | 'Entretenimiento' | 'Salud' | 'Educación' | 'Otros'} />
      </div>
      <div className="grid gap-1">
        <p className="text-sm font-medium leading-none">
          {spending.name}
        </p>
        <p className="text-sm text-muted-foreground/50">
          {formatDate(spending.createdAt)} · Grupo: {spending.group.name}
        </p>
      </div>
      <div className="ml-auto font-medium">{formatMoney(spending.value)}</div>
    </div>
  )
}

const SpendingItemSkeleton = () => {
  return (
    <div className="flex items-center gap-4">
      <div className={cn(buttonVariants({ variant: 'secondary', size: 'icon' }), 'rounded-full')}>
        <Skeleton className="w-8 h-8 rounded-full" />
      </div>
      <div className="grid gap-1">
        <Skeleton className="w-20 h-4" />
        <Skeleton className="w-20 h-4" />
      </div>
      <div className="ml-auto font-medium">
        <Skeleton className="w-8 h-4" />
      </div>
    </div>
  )
}

export function LatestsSpendingsSkeleton () {
  return (
    <Card className='xl:col-span-2 h-min'>
      <CardHeader>
        <CardTitle>Últimos gastos</CardTitle>
        <CardDescription>
          Gastos registrados en los últimos 30 días
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <SpendingItemSkeleton />
          <SpendingItemSkeleton />
          <SpendingItemSkeleton />
        </div>
      </CardContent>
    </Card>
  )
}
