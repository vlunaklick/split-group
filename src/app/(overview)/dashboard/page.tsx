import { StatsChart } from '@/components/dashboard/chart-spendings'
import { LatestsSpendings, LatestsSpendingsSkeleton } from '@/components/dashboard/latest-spendings'
import { StatCardSkeleton, WeeklySpent, MonthlySpent, TotalRevenue, TotalDebt } from '@/components/dashboard/stats'
import { Suspense } from 'react'

export default async function HomeDashboard () {
  return (
    <div className='flex flex-col gap-8'>
      <header className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Suspense fallback={<StatCardSkeleton />}>
          <WeeklySpent />
        </Suspense>

        <Suspense fallback={<StatCardSkeleton />}>
          <MonthlySpent />
        </Suspense>

        <Suspense fallback={<StatCardSkeleton />}>
          <TotalRevenue />
        </Suspense>

        <Suspense fallback={<StatCardSkeleton />}>
          <TotalDebt />
        </Suspense>
      </header>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-4">
        <StatsChart />

        <Suspense fallback={<LatestsSpendingsSkeleton />}>
          <LatestsSpendings />
        </Suspense>
      </div>
    </div>
  )
}
