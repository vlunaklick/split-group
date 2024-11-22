import { removeUserInvitation } from '@/app/(overview)/groups/[groupId]/participants/actions'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetUsersInvitedToGroup } from '@/data/groups'
import { displayToast } from '@/utils/toast-display'
import { X } from 'lucide-react'
import { useState } from 'react'
import { useSWRConfig } from 'swr'

export function MembersInvitedList ({ groupId }: { groupId: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const { mutate } = useSWRConfig()

  const { data: invitations, isLoading: isLoadingMembers } = useGetUsersInvitedToGroup({ groupId })

  const onRemove = async (userId: string) => {
    setIsLoading(true)
    try {
      await removeUserInvitation(userId, groupId)
      mutate(['/api/groups/members/invited', groupId])
    } catch (error) {
      displayToast('Hubo un error al remover la invitación al miembro.', 'error')
      return
    }

    displayToast('Invitación removida correctamente.', 'success')
    setIsLoading(false)
  }

  return (
    <article>
      <header>
        <h3 className="text-lg font-medium">Miembros invitados</h3>
        <p className="text-sm text-muted-foreground mb-2">
          Estos son los miembros que has invitado a unirse a este grupo.
        </p>
      </header>

      {isLoadingMembers && (
        <ul className="space-y-2">
          <RowSkeleton />
          <RowSkeleton />
          <RowSkeleton />
        </ul>
      )}

      {invitations?.length === 0 && <p className="text-sm text-muted-foreground">No has invitado a ningún miembro a unirse a este grupo.</p>}

      {invitations?.length > 0 && (
        <ul className="space-y-2">
          {invitations?.map((invitation: any) => (
            <li key={invitation.user.id} className="flex items-center gap-4 w-full">
              <Avatar>
                <AvatarFallback>{invitation.user.name?.charAt(0) ?? 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{invitation.user.name}</p>
                <p className="text-xs text-muted-foreground">{invitation.user.email}</p>
              </div>
              <div className="ml-auto">
                <Button variant="ghost" size='icon' onClick={() => onRemove(invitation.user.id)} disabled={isLoading}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

const RowSkeleton = () => {
  return (
    <li className="flex items-center gap-4 w-full">
      <Avatar>
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
      <div>
        <Skeleton className="h-4 w-24 mb-1" />
        <Skeleton className="h-3 w-32" />
      </div>
      <div className="ml-auto">
        <Button variant="ghost" size="icon" disabled>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </li>
  )
}
