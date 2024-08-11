import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getInvitationByCode } from './actions'
import { ActionButtons } from './buttons'
import { Icon } from '@/components/group-icons'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

export default async function JoinInvitation ({ params } : { params: { code: string } }) {
  const code = params.code

  if (!code) {
    notFound()
  }

  const session = await getServerSession(authOptions)
  const invitation = await getInvitationByCode(code)

  const isAlreadyInGroup = invitation?.group.users.some(user => user.id === session?.user.id)

  if (!invitation || isAlreadyInGroup) {
    notFound()
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 max-w-[350px] mx-auto">
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

        <ActionButtons userId={session?.user.id as string} code={code} groupId={invitation.group.id} />
      </div>

    </div>
  )
}
