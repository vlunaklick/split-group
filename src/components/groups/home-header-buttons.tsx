import { Button, buttonVariants } from '@/components/ui/button'
import { hasGroupAdminPermission } from '@/data/apis/groups'
import { cn } from '@/lib/utils'
import { IconUsersGroup } from '@tabler/icons-react'
import Link from 'next/link'
import { ExportButton } from './export-button'
import { GroupConfigSheet } from './sheets/group-config-sheet'
import { CreateSpendingSheet } from '@/components/spendings/sheets/create-spending-sheet'

export const HeaderButtons = async ({ groupId }: { groupId: string }) => {
  const hasPermission = await hasGroupAdminPermission(groupId)

  return (
    <>
      <CreateSpendingSheet groupId={groupId} variant="default" />

      <Link href={`/groups/${groupId}/participants`} className={cn(buttonVariants({ variant: 'outline' }))}>
        Participantes
      </Link>

      <ExportButton groupId={groupId} />

      {hasPermission && (
        <GroupConfigSheet groupId={groupId} />
      )}
    </>
  )
}

export const HeaderButtonsMobile = async ({ groupId }: { groupId: string }) => {
  const hasPermission = await hasGroupAdminPermission(groupId)

  return (
    <div className="flex gap-2 md:hidden shrink-0">
      <CreateSpendingSheet groupId={groupId} variant="default" className="[&_button]:px-3 [&_button]:text-sm" />

      <Link href={`/groups/${groupId}/participants`} className={cn(buttonVariants({ variant: 'outline', size: 'icon' }))}>
        <IconUsersGroup className="h-4 w-4" />
        <span className="sr-only">Participantes</span>
      </Link>

      <ExportButton groupId={groupId} triggerIcon />

      {hasPermission && (
        <GroupConfigSheet groupId={groupId} />
      )}
    </div>
  )
}

export const HeaderButtonsSkeletons = () => {
  return (
    <>
      <div className="hidden md:flex gap-2">
        <Button disabled>Crear gasto</Button>
        <Button variant="outline" disabled>
          Participantes
        </Button>
        <Button variant="outline" disabled>
          Exportar
        </Button>
      </div>

      <div className="flex gap-2 md:hidden">
        <Button size="sm" disabled>Crear</Button>
        <Button variant="outline" size="icon" disabled>
          <IconUsersGroup className="h-4 w-4" />
        </Button>
      </div>
    </>
  )
}
