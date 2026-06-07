import { removeUserInvitation } from '@/app/(overview)/groups/[groupId]/participants/actions'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetUsersInvitedToGroup } from '@/data/groups'
import { cn } from '@/lib/utils'
import { displayToast } from '@/utils/toast-display'
import { useState } from 'react'
import { useSWRConfig } from 'swr'

export function MembersInvitedList ({ groupId, embedded = false }: { groupId: string, embedded?: boolean }) {
  const [isLoading, setIsLoading] = useState(false)
  const { mutate } = useSWRConfig()

  const { data: invitations, isLoading: isLoadingMembers } = useGetUsersInvitedToGroup({ groupId })

  const onRemove = async (userId: string) => {
    setIsLoading(true)
    try {
      await removeUserInvitation(userId, groupId)
      mutate(['/api/groups/members/invited', groupId])
      displayToast('Invitación cancelada', 'success')
    } catch (error) {
      displayToast('No se pudo cancelar la invitación', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const listClassName = cn(
    'divide-y divide-border',
    embedded ? 'overflow-hidden rounded-md border border-border bg-card' : 'surface-panel'
  )

  if (isLoadingMembers) {
    return (
      <ul className={listClassName}>
        <RowSkeleton />
        <RowSkeleton />
      </ul>
    )
  }

  if (invitations?.length === 0) {
    return <p className="text-sm text-muted-foreground">Nadie invitado por email todavía.</p>
  }

  return (
    <ul className={listClassName}>
      {invitations?.map((invitation: any) => (
        <li key={invitation.user.id} className="flex items-center gap-3 px-4 py-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium">
            {invitation.user.name?.charAt(0)?.toUpperCase() ?? 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{invitation.user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{invitation.user.email}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 shrink-0 px-2 text-xs"
            onClick={() => onRemove(invitation.user.id)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
        </li>
      ))}
    </ul>
  )
}

const RowSkeleton = () => (
  <li className="flex items-center gap-3 px-4 py-3">
    <Skeleton className="h-9 w-9 rounded-full" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-3 w-36" />
    </div>
    <Skeleton className="h-8 w-16" />
  </li>
)
