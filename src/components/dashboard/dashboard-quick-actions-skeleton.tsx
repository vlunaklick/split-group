import { Skeleton } from '@/components/ui/skeleton'

export function DashboardQuickActionsSkeleton () {
  return (
    <section className="grid gap-3">
      <Skeleton className="h-3 w-16" />
      <ul className="divide-y divide-border rounded-lg border border-border">
        {Array.from({ length: 3 }).map((_, i) => (
          <li key={i} className="flex items-center gap-3 px-4 py-3">
            <Skeleton className="h-4 w-28 flex-1" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-14" />
          </li>
        ))}
      </ul>
    </section>
  )
}
