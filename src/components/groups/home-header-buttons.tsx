import { Button, buttonVariants } from '@/components/ui/button'
import { hasGroupAdminPermission } from '@/data/apis/groups'
import { cn } from '@/lib/utils'
import { IconSettings, IconUsersGroup } from '@tabler/icons-react'
import Link from 'next/link'
import { ExportButton } from './export-button'

export const HeaderButtons = async ({ groupId }: { groupId: string }) => {
  const hasPermission = await hasGroupAdminPermission(groupId)

  return (
    <>
      <Link href={`/groups/${groupId}/participants`} className={cn(buttonVariants({ variant: 'outline' }), 'md:inline hidden')}>
        Participantes
      </Link>

      <ExportButton groupId={groupId} />

      {hasPermission && (
        <Link href={`/groups/${groupId}/settings`} className={cn(buttonVariants({ variant: 'outline', size: 'icon' }), 'hidden md:flex')}>
          <IconSettings />
        </Link>
      )}
    </>
  )
}

export const HeaderButtonsMobile = async ({ groupId }: { groupId: string }) => {
  const hasPermission = await hasGroupAdminPermission(groupId)

  return (
    <div className="flex gap-2 md:hidden">
      <Link href={`/groups/${groupId}/participants`} className={cn(buttonVariants({ variant: 'outline', size: 'icon' }))}>
        <IconUsersGroup />
      </Link>

      {hasPermission && (
        <Link href={`/groups/${groupId}/settings`} className={cn(buttonVariants({ variant: 'outline', size: 'icon' }))}>
          <IconSettings />
        </Link>
      )}
    </div>
  )
}

export const HeaderButtonsSkeletons = () => {
  return (
    <>
      <div className="hidden md:flex gap-2">
        <Button variant="outline" className="md:inline hidden" disabled>
          Participantes
        </Button>
        <Button variant="outline" disabled>
          Exportar
        </Button>
      </div>

      <div className="flex gap-2 md:hidden">
        <Button variant="outline" size="icon" disabled>
          <IconUsersGroup />
        </Button>
      </div>
    </>
  )
}
