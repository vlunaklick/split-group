import { cn } from '@/lib/utils'

export function Logo ({ className, fullName = 'Spendwise' }: { className?: string, fullName?: string }) {
  return (
    <div className={cn('flex items-center', className)}>
      <h1 className="text-3xl font-semibold text-foreground">
        S
        <span className="text-emerald-500" aria-hidden="true">.</span>
      </h1>
      <span className="sr-only">{fullName}</span>
    </div>
  )
}
