import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { CheckCircle2, Circle } from 'lucide-react'

export function ChecklistItem ({
  done,
  label,
  description,
  action
}: {
  done: boolean
  label: string
  description: string
  action?: ReactNode
}) {
  return (
    <li className={cn(
      'flex flex-col gap-2 rounded-lg border border-border bg-card p-3 sm:flex-row sm:items-center sm:justify-between',
      done && 'border-success/30 bg-success/5'
    )}>
      <div className="flex min-w-0 items-start gap-3">
        {done
          ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
          : <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />}
        <div className="min-w-0 grid gap-0.5">
          <p className={cn('text-sm font-medium', done && 'text-muted-foreground line-through decoration-muted-foreground/60')}>
            {label}
          </p>
          {!done && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
      </div>
      {!done && action && <div className="shrink-0 sm:pl-0 pl-7">{action}</div>}
    </li>
  )
}
