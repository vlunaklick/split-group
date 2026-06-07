import { Icon } from '@/components/group-icons'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { getUserInvitation } from './actions'
import { ActionButtons } from './buttons'
import { IconMoodConfuzedFilled } from '@tabler/icons-react'
import Link from 'next/link'

export async function Join ({ code }: { code: string }) {
  const invitation = await getUserInvitation(code)

  if (!invitation?.group || invitation.uses >= (invitation.maxUses ?? 0)) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <IconMoodConfuzedFilled className="h-20 w-20 text-muted-foreground" aria-hidden="true" />
        <h1 className="text-display-sm">Enlace no válido</h1>
        <p className="text-balance text-muted-foreground">
          Este enlace expiró o ya no tiene usos disponibles.
        </p>
        <Link href="/dashboard" className={buttonVariants({ variant: 'outline' })}>
          Ir al inicio
        </Link>
      </div>
    )
  }

  if (invitation.isAlreadyMember) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className={cn(buttonVariants({ variant: 'secondary', size: 'icon' }), 'h-14 w-14 rounded-full')}>
          <Icon type={invitation.group.icon ?? 'award'} />
        </div>
        <h1 className="text-display-sm">Ya estás en {invitation.group.name}</h1>
        <p className="text-balance text-muted-foreground">
          Este grupo ya está en tu lista. Podés ir directo al resumen.
        </p>
        <Link href={`/groups/${invitation.group.id}`} className={buttonVariants({ variant: 'default' })}>
          Ir al grupo
        </Link>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col items-center gap-6 text-center">
      <div className={cn(buttonVariants({ variant: 'secondary', size: 'icon' }), 'h-14 w-14 rounded-full')}>
        <Icon type={invitation.group.icon ?? 'award'} />
      </div>

      <div className="grid gap-2">
        <h1 className="text-display-sm">Unirte a {invitation.group.name}</h1>
        {invitation.group.description && (
          <p className="text-sm text-muted-foreground">{invitation.group.description}</p>
        )}
        <p className="text-balance text-muted-foreground">
          Vas a poder ver y registrar gastos con el resto del grupo.
        </p>
      </div>

      <ActionButtons code={code} groupId={invitation.group.id} />
    </div>
  )
}
