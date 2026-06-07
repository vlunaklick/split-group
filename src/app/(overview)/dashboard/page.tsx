import { StatsChart } from '@/components/dashboard/chart-spendings'
import { DashboardQuickActions } from '@/components/dashboard/dashboard-quick-actions'
import { DashboardQuickActionsSkeleton } from '@/components/dashboard/dashboard-quick-actions-skeleton'
import { LatestsSpendings, LatestsSpendingsSkeleton } from '@/components/dashboard/latest-spendings'
import { WeeklySpent, MonthlySpent, TotalRevenue, TotalDebt } from '@/components/dashboard/stats'
import { Suspense } from 'react'

export default async function HomeDashboard () {
  return (
    <div className="flex flex-col gap-8">
      <header className="grid gap-1">
        <h1 className="text-display-sm">Tu resumen</h1>
        <p className="text-muted-foreground">
          Balance entre grupos y accesos rápidos a lo que más usás.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <TotalDebt />
        <TotalRevenue />
      </section>

      <Suspense fallback={<DashboardQuickActionsSkeleton />}>
        <DashboardQuickActions />
      </Suspense>

      <section className="grid gap-4 md:grid-cols-2">
        <WeeklySpent />
        <MonthlySpent />
      </section>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-4">
        <StatsChart />

        <Suspense fallback={<LatestsSpendingsSkeleton />}>
          <LatestsSpendings />
        </Suspense>
      </div>
    </div>
  )
}
