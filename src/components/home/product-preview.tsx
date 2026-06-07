import { cn } from '@/lib/utils'
import { formatMoney } from '@/lib/money'
import { ArrowRight, Check, Receipt, Users } from 'lucide-react'

const expenses = [
  { initials: 'M', name: 'Martín', label: 'Supermercado', amount: 12400, tone: 'bg-primary/15 text-primary' },
  { initials: 'C', name: 'Camila', label: 'Asado del domingo', amount: 28000, tone: 'bg-success/15 text-success' },
  { initials: 'V', name: 'Vos', label: 'Nafta ida y vuelta', amount: 4800, tone: 'bg-muted text-muted-foreground' }
]

const balances = [
  { from: 'Martín', to: 'Vos', amount: 3500 },
  { from: 'Vos', to: 'Camila', amount: 1200 }
]

function Avatar ({ initials, className }: { initials: string; className?: string }) {
  return (
    <span
      className={cn(
        'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold',
        className
      )}
    >
      {initials}
    </span>
  )
}

export function ProductPreview () {
  return (
    <div
      className="relative overflow-hidden rounded-xl border border-border bg-card"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,hsl(var(--primary)/0.08),transparent_55%)]" />

      <div className="relative border-b border-border px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex gap-1.5" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-border" />
              <span className="h-2.5 w-2.5 rounded-full bg-border" />
              <span className="h-2.5 w-2.5 rounded-full bg-border" />
            </div>
            <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
              <Users className="h-3.5 w-3.5 text-primary" />
              Viaje Bariloche
            </div>
          </div>
          <span className="rounded-full border border-border bg-background px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            4 miembros
          </span>
        </div>
      </div>

      <div className="relative space-y-4 p-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-border bg-background p-3">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Total del grupo</p>
            <p className="mt-1 font-mono text-lg tracking-tight text-foreground">
              {formatMoney(45200)}
            </p>
          </div>
          <div className="rounded-lg border border-primary/25 bg-primary/5 p-3">
            <p className="text-[11px] uppercase tracking-wide text-primary">Tu balance</p>
            <p className="mt-1 font-mono text-lg tracking-tight text-foreground">
              Te deben {formatMoney(3500)}
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-background p-3">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
              <Receipt className="h-3.5 w-3.5 text-muted-foreground" />
              Últimos gastos
            </div>
            <span className="text-[11px] text-muted-foreground">Esta semana</span>
          </div>

          <ul className="space-y-2.5">
            {expenses.map((expense) => (
              <li key={expense.label} className="flex items-center gap-2.5">
                <Avatar initials={expense.initials} className={expense.tone} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-foreground">{expense.label}</p>
                  <p className="text-[11px] text-muted-foreground">Pagó {expense.name}</p>
                </div>
                <span className="shrink-0 font-mono text-xs text-foreground">
                  {formatMoney(expense.amount)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-border bg-background p-3">
          <p className="mb-2.5 text-xs font-medium text-foreground">Plan de liquidación</p>
          <ul className="space-y-2">
            {balances.map((balance, index) => (
              <li
                key={`${balance.from}-${balance.to}`}
                className="flex items-center justify-between gap-2 text-sm"
              >
                <span className="text-muted-foreground">
                  {balance.from}
                  <ArrowRight className="mx-1 inline h-3 w-3" aria-hidden="true" />
                  {balance.to}
                </span>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="font-mono text-xs font-medium text-foreground">
                    {formatMoney(balance.amount)}
                  </span>
                  {index === 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">
                      <Check className="h-2.5 w-2.5" aria-hidden="true" />
                      Pagado
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
