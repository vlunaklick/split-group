import { CreateSpendingSheet } from '@/components/spendings/sheets/create-spending-sheet'
import { CreateGroupSheet } from '@/components/groups/sheets/create-group-sheet'
import { Icon } from '@/components/group-icons'
import { buttonVariants } from '@/components/ui/button'
import { getUserGroups } from '@/data/apis/groups'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export async function DashboardQuickActions () {
  const groups = await getUserGroups()

  if (groups.length === 0) {
    return (
      <section className="surface-panel grid gap-4 p-5">
        <div className="grid gap-1">
          <h2 className="text-base font-medium">Tu primer grupo</h2>
          <p className="text-sm text-muted-foreground">
            Creá un espacio para dividir gastos con tu gente.
          </p>
        </div>
        <CreateGroupSheet className="w-fit" />
      </section>
    )
  }

  return (
    <section className="grid gap-3">
      <h2 className="section-label">Tus grupos</h2>
      <ul className="surface-panel divide-y divide-border">
        {groups.map((group) => (
          <li key={group.id} className="flex items-center gap-3 px-4 py-3.5">
            <Link
              href={`/groups/${group.id}`}
              className="flex min-w-0 flex-1 items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                <Icon type={group.icon ?? 'award'} />
              </div>
              <span className="truncate text-sm font-medium">{group.name}</span>
            </Link>
            <div className="flex shrink-0 gap-2">
              <CreateSpendingSheet
                groupId={group.id}
                variant="default"
                className="h-8 px-3 text-xs"
              />
              <Link
                href={`/groups/${group.id}`}
                className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'h-8 px-3 text-xs')}
              >
                Ver
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
