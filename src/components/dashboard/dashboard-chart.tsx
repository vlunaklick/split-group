'use client'

import { StatsChart } from '@/components/dashboard/chart-spendings'

export function DashboardChart () {
  return (
    <section className="grid gap-3">
      <div className="grid gap-1">
        <h2 className="section-label">Gasto por mes</h2>
        <p className="text-xs text-muted-foreground">
          Tu parte registrada como deudor en cada mes del año.
        </p>
      </div>
      <StatsChart />
    </section>
  )
}
