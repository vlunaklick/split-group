import { DashboardContent, DashboardContentSkeleton } from '@/components/dashboard/dashboard-content'
import { Suspense } from 'react'

export default async function HomeDashboard () {
  return (
    <div className="flex w-full min-w-0 flex-col gap-6 sm:gap-8">
      <header className="grid gap-1.5">
        <h1 className="text-display-sm">Inicio</h1>
        <p className="text-sm text-muted-foreground">
          Balance, actividad por grupo y movimientos recientes.
        </p>
      </header>

      <Suspense fallback={<DashboardContentSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  )
}
