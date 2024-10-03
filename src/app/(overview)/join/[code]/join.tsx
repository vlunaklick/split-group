import { Icon } from '@/components/group-icons'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { getUserInvitation } from './actions'
import { ActionButtons } from './buttons'
import { IconMoodConfuzedFilled } from '@tabler/icons-react'

export async function Join ({ code }: { code: string }) {
  const invitation = await getUserInvitation(code)

  if (!invitation || !invitation.group || invitation.uses >= (invitation.maxUses ?? 0)) {
    return (
      <>
        <IconMoodConfuzedFilled className="h-24 w-24 text-muted-foreground" aria-hidden="true" />
        <h1 className="text-3xl font-semibold">Invitación no válida</h1>
        <p className="text-balance text-muted-foreground">La invitación que intenta usar no es válida o la cantidad máxima de usos ha sido alcanzada.</p>
      </>
    )
  }

  return (
    <>
      <header className='flex flex-col'>
        <div className={cn(buttonVariants({ variant: 'secondary', size: 'icon' }), 'rounded-full mx-auto mb-4')}>
          <Icon type={invitation.group.icon as string} />
        </div>
        <h1 className="text-3xl font-semibold">Unirse a &quot;{invitation?.group.name}&quot;</h1>
      </header>

      <div className="grid gap-2 text-center">
        <p className="text-balance text-muted-foreground">
          Usted ha sido invitado a unirse a {invitation?.group.name}. Una vez que se una, podrá ver y compartir gastos con los miembros del grupo.
        </p>

        <ActionButtons code={code} groupId={invitation.group.id} />
      </div>
    </>
  )
}
