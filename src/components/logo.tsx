import { cn } from '@/lib/utils'

export function Logo ({ className, fullName = 'Split Group' }: { className?: string, fullName?: string }) {
  return (
    <div className={cn('flex items-center', className)}>
      <span className="text-2xl font-normal tracking-tight text-foreground" aria-hidden="true">
        S<span className="text-primary">.</span>
      </span>
      <span className="sr-only">{fullName}</span>
    </div>
  )
}
