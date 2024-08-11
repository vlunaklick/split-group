import { cn } from '@/lib/utils'

export function Logo ({ className }: { className?: string }) {
  return (
    <h1 className={cn('text-3xl font-semibold dark:text-white text-black', className)}>
      S
      <span className="text-emerald-500">.</span>
    </h1>
  )
}
