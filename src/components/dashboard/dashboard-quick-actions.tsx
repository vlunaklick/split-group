import { CreateSpendingSheet } from '@/components/spendings/sheets/create-spending-sheet'
import { CreateGroupSheet } from '@/components/groups/sheets/create-group-sheet'
import { Icon } from '@/components/group-icons'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getUserGroups } from '@/data/apis/groups'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export async function DashboardQuickActions () {
  const groups = await getUserGroups()

  if (groups.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Empezá acá</CardTitle>
          <CardDescription>
            Creá un grupo para dividir gastos con amigos, roomies o viajes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateGroupSheet className="w-full sm:w-auto" />
        </CardContent>
      </Card>
    )
  }

  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {groups.map((group) => (
        <Card key={group.id} className="flex flex-col">
          <CardHeader className="pb-3">
            <Link
              href={`/groups/${group.id}`}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                <Icon type={group.icon ?? 'award'} />
              </div>
              <CardTitle className="text-base truncate">{group.name}</CardTitle>
            </Link>
          </CardHeader>
          <CardContent className="mt-auto flex gap-2">
            <CreateSpendingSheet groupId={group.id} variant="default" className="flex-1" />
            <Link
              href={`/groups/${group.id}`}
              className={cn(buttonVariants({ variant: 'outline' }), 'flex-1')}
            >
              Ver grupo
            </Link>
          </CardContent>
        </Card>
      ))}
    </section>
  )
}
