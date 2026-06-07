import { CreateGroupSheet } from '@/components/groups/sheets/create-group-sheet'
import { Icon } from '@/components/group-icons'
import { DashboardChart } from '@/components/dashboard/dashboard-chart'
import { CreateSpendingSheet } from '@/components/spendings/sheets/create-spending-sheet'
import { getDashboardOverview, getLatestSpendings } from '@/data/apis/dashboard'
import { formatDate } from '@/lib/dates'
import { formatMoney } from '@/lib/money'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { ArrowDownRight, ArrowUpRight, Plus } from 'lucide-react'

function StatCell ({
  label,
  value,
  hint,
  tone
}: {
  label: string
  value: string
  hint?: string
  tone?: 'positive' | 'negative' | 'neutral'
}) {
  return (
    <div className="grid gap-0.5 bg-card p-4">
      <p className="section-label">{label}</p>
      <p className={cn(
        'font-mono text-xl tracking-tight',
        tone === 'positive' && 'text-success',
        tone === 'negative' && 'text-destructive'
      )}>
        {value}
      </p>
      {hint && <p className="text-xs leading-snug text-muted-foreground">{hint}</p>}
    </div>
  )
}

function trendHint (current: number, previous: number, suffix: string) {
  if (current === 0 && previous === 0) return `Sin movimiento ${suffix}`
  if (current > previous) return `↑ vs ${suffix} anterior (${formatMoney(previous)})`
  if (current < previous) return `↓ vs ${suffix} anterior (${formatMoney(previous)})`
  return `Igual que ${suffix} anterior`
}

function balanceClassName (tone: 'positive' | 'negative' | 'neutral') {
  return cn(
    'font-mono text-sm',
    tone === 'positive' && 'text-success',
    tone === 'negative' && 'text-destructive',
    tone === 'neutral' && 'text-muted-foreground'
  )
}

function groupBalanceText (net: number) {
  if (net > 0) return { text: `+${formatMoney(net)}`, tone: 'positive' as const }
  if (net < 0) return { text: formatMoney(net), tone: 'negative' as const }
  return { text: 'Al día', tone: 'neutral' as const }
}

function GroupLastSpending ({
  lastSpending
}: {
  lastSpending: { name: string, createdAt: Date, value: number } | null
}) {
  if (!lastSpending) {
    return <p className="text-xs text-muted-foreground">Sin gastos</p>
  }

  return (
    <>
      <p className="truncate text-sm">{lastSpending.name}</p>
      <p className="truncate text-xs text-muted-foreground">
        {formatDate(lastSpending.createdAt)} · {formatMoney(lastSpending.value)}
      </p>
    </>
  )
}

function MobileGroupRow ({
  group,
  balance
}: {
  group: {
    id: string
    name: string
    icon: string | null
    memberCount: number
    spendingCount: number
    lastSpending: { name: string, createdAt: Date, value: number } | null
  }
  balance: ReturnType<typeof groupBalanceText>
}) {
  return (
    <div className="px-4 py-3">
      <div className="flex items-start gap-3">
        <Link href={`/groups/${group.id}`} className="flex min-w-0 flex-1 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
            <Icon type={group.icon ?? 'award'} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{group.name}</p>
            <p className="text-xs text-muted-foreground">
              {group.memberCount} miembros · {group.spendingCount} gastos
            </p>
          </div>
        </Link>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <span className={balanceClassName(balance.tone)}>{balance.text}</span>
          <CreateSpendingSheet
            groupId={group.id}
            variant="outline"
            label=""
            className="h-8 w-8 p-0"
            icon={<Plus className="h-4 w-4" />}
          />
        </div>
      </div>
      <div className="mt-2 min-w-0 pl-12">
        <GroupLastSpending lastSpending={group.lastSpending} />
      </div>
    </div>
  )
}

export async function DashboardContent () {
  const [overview, latestSpendings] = await Promise.all([
    getDashboardOverview(),
    getLatestSpendings()
  ])

  if (overview.groups.length === 0) {
    return (
      <section className="surface-panel grid gap-4 p-6">
        <div className="grid gap-1.5">
          <h2 className="text-base font-medium">Empezá con tu primer grupo</h2>
          <p className="text-sm text-muted-foreground">
            Creá un espacio para cargar gastos y ver quién le debe a quién.
          </p>
        </div>
        <CreateGroupSheet className="w-fit" />
      </section>
    )
  }

  const { stats } = overview
  const netTone = overview.netBalance > 0
    ? 'positive'
    : overview.netBalance < 0
      ? 'negative'
      : 'neutral'

  return (
    <div className="flex w-full min-w-0 flex-col gap-6 sm:gap-8">
      <section className="surface-panel grid w-full grid-cols-1 gap-px overflow-hidden bg-border sm:grid-cols-2 lg:grid-cols-4">
        <StatCell
          label="Balance neto"
          value={`${overview.netBalance >= 0 ? '+' : ''}${formatMoney(overview.netBalance)}`}
          hint={overview.netBalance === 0
            ? `${stats.groupCount} grupos · al día`
            : `Te deben ${formatMoney(overview.totalRevenue)} · Debés ${formatMoney(overview.totalDebt)}`}
          tone={netTone}
        />
        <StatCell
          label="Te deben"
          value={formatMoney(overview.totalRevenue)}
          hint={stats.openDebtsCount > 0
            ? `${stats.openDebtsCount} ${stats.openDebtsCount === 1 ? 'cuenta pendiente' : 'cuentas pendientes'}`
            : 'Sin deudas a tu favor'}
          tone={overview.totalRevenue > 0 ? 'positive' : 'neutral'}
        />
        <StatCell
          label="Debés"
          value={formatMoney(overview.totalDebt)}
          hint={overview.totalDebt > 0 ? 'Pendiente de pago' : 'Nada pendiente'}
          tone={overview.totalDebt > 0 ? 'negative' : 'neutral'}
        />
        <StatCell
          label="Tu parte este mes"
          value={formatMoney(stats.monthlySpent)}
          hint={trendHint(stats.monthlySpent, stats.monthlySpentPrev, 'mes')}
        />
      </section>

      <div className="flex w-full min-w-0 flex-col gap-6 xl:flex-row xl:gap-8">
        <section className="min-w-0 flex-1">
          <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
            <h2 className="section-label">Grupos</h2>
            <p className="text-xs text-muted-foreground">
              {stats.totalSpendings} gastos · {formatMoney(stats.weeklySpent)} esta semana
            </p>
          </div>

          <div className="surface-panel overflow-hidden">
            <div className="hidden border-b border-border bg-muted/20 px-4 py-2.5 text-xs text-muted-foreground xl:grid xl:grid-cols-[minmax(0,1.4fr)_72px_72px_96px_minmax(0,1fr)_40px] xl:gap-3">
              <span>Grupo</span>
              <span className="text-center">Miembros</span>
              <span className="text-center">Gastos</span>
              <span className="text-right">Balance</span>
              <span>Último gasto</span>
              <span />
            </div>

            <ul className="divide-y divide-border">
              {overview.groups.map((group) => {
                const balance = groupBalanceText(group.netBalance)

                return (
                  <li key={group.id}>
                    <div className="xl:hidden">
                      <MobileGroupRow group={group} balance={balance} />
                    </div>

                    <div className="hidden px-4 py-3 xl:grid xl:grid-cols-[minmax(0,1.4fr)_72px_72px_96px_minmax(0,1fr)_40px] xl:items-center xl:gap-3">
                      <Link href={`/groups/${group.id}`} className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
                          <Icon type={group.icon ?? 'award'} />
                        </div>
                        <p className="truncate text-sm font-medium">{group.name}</p>
                      </Link>

                      <p className="text-center text-sm text-muted-foreground">{group.memberCount}</p>
                      <p className="text-center text-sm text-muted-foreground">{group.spendingCount}</p>
                      <p className={cn('text-right', balanceClassName(balance.tone))}>{balance.text}</p>

                      <div className="min-w-0">
                        <GroupLastSpending lastSpending={group.lastSpending} />
                      </div>

                      <CreateSpendingSheet
                        groupId={group.id}
                        variant="outline"
                        label=""
                        className="h-8 w-8 shrink-0 p-0"
                        icon={<Plus className="h-4 w-4" />}
                      />
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>

        <aside className="flex w-full min-w-0 shrink-0 flex-col gap-6 xl:w-80">
          <section>
            <h2 className="section-label mb-3">Por saldar</h2>
            {overview.pending.length === 0
              ? (
                <div className="surface-panel px-4 py-8 text-center text-sm text-balance text-muted-foreground">
                  No hay deudas abiertas entre vos y otros miembros.
                </div>
                )
              : (
                <ul className="surface-panel divide-y divide-border">
                  {overview.pending.map((item) => (
                    <li key={`${item.groupId}-${item.personId}-${item.amount}`}>
                      <Link
                        href={`/groups/${item.groupId}`}
                        className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-accent/50"
                      >
                        <div className={cn(
                          'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
                          item.amount > 0 ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                        )}>
                          {item.amount > 0
                            ? <ArrowUpRight className="h-3.5 w-3.5" />
                            : <ArrowDownRight className="h-3.5 w-3.5" />}
                        </div>
                        <div className="min-w-0 flex-1 grid gap-0.5">
                          <p className="truncate text-sm font-medium">{item.personName}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {item.groupName} · {item.amount > 0 ? 'Te debe' : 'Le debés'}
                          </p>
                        </div>
                        <span className={cn(
                          'shrink-0 font-mono text-sm',
                          item.amount > 0 ? 'text-success' : 'text-destructive'
                        )}>
                          {item.amount > 0 ? '+' : ''}{formatMoney(item.amount)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                )}
          </section>

          <section className="surface-panel grid gap-3 p-4">
            <h2 className="section-label">Resumen</h2>
            <dl className="grid gap-2.5 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">Grupos activos</dt>
                <dd className="font-medium">{stats.groupCount}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">Gastos registrados</dt>
                <dd className="font-medium">{stats.totalSpendings}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">Esta semana (tu parte)</dt>
                <dd className="font-mono">{formatMoney(stats.weeklySpent)}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">Mes anterior (tu parte)</dt>
                <dd className="font-mono text-muted-foreground">{formatMoney(stats.monthlySpentPrev)}</dd>
              </div>
            </dl>
          </section>
        </aside>
      </div>

      <section className="min-w-0">
        <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
          <h2 className="section-label">Últimos gastos</h2>
          {(latestSpendings?.length ?? 0) > 0 && (
            <p className="text-xs text-muted-foreground">
              {latestSpendings!.length} movimientos recientes
            </p>
          )}
        </div>

        {!latestSpendings?.length && (
          <p className="text-sm text-muted-foreground">
            Todavía no hay gastos. Usá el botón + en un grupo para cargar el primero.
          </p>
        )}

        {latestSpendings && latestSpendings.length > 0 && (
          <div className="surface-panel overflow-hidden">
            <ul className="divide-y divide-border">
              {latestSpendings.map((spending) => (
                <li key={spending.id}>
                  <Link
                    href={`/groups/${spending.groupId}/spendings/${spending.id}`}
                    className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-accent/50 lg:hidden"
                  >
                    <div className="min-w-0 flex-1 grid gap-0.5">
                      <p className="truncate text-sm font-medium">{spending.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {spending.group.name}
                        {' · '}
                        {spending.owner.name ?? spending.owner.username ?? '—'}
                        {' · '}
                        {formatDate(spending.date ?? spending.createdAt)}
                      </p>
                    </div>
                    <span className="shrink-0 font-mono text-sm">
                      {formatMoney(spending.value)}
                    </span>
                  </Link>

                  <Link
                    href={`/groups/${spending.groupId}/spendings/${spending.id}`}
                    className="hidden px-4 py-3 transition-colors hover:bg-accent/50 lg:grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,0.8fr)_100px_100px_96px] lg:items-center lg:gap-4"
                  >
                    <p className="truncate text-sm font-medium">{spending.name}</p>
                    <p className="truncate text-sm text-muted-foreground">{spending.group.name}</p>
                    <p className="truncate text-sm text-muted-foreground">
                      {spending.owner.name ?? spending.owner.username ?? '—'}
                    </p>
                    <p className="truncate text-sm text-muted-foreground">
                      {spending.category?.name ?? '—'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(spending.date ?? spending.createdAt)}
                    </p>
                    <p className="font-mono text-sm lg:text-right">{formatMoney(spending.value)}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <DashboardChart />
    </div>
  )
}

export function DashboardContentSkeleton () {
  return (
    <div className="flex w-full min-w-0 flex-col gap-6 sm:gap-8">
      <div className="surface-panel h-28 animate-pulse bg-muted/20" />
      <div className="flex flex-col gap-6 xl:flex-row">
        <div className="surface-panel h-64 flex-1 animate-pulse bg-muted/20" />
        <div className="surface-panel h-64 w-full animate-pulse bg-muted/20 xl:w-80" />
      </div>
      <div className="surface-panel h-48 animate-pulse bg-muted/20" />
    </div>
  )
}
