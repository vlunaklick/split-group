'use client'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetGroupParticipants } from '@/data/groups'
import { cn } from '@/lib/utils'
import { displayToast } from '@/utils/toast-display'
import { useState } from 'react'
import { useSWRConfig } from 'swr'
import { removeMemberFromGroup } from '../../../app/(overview)/groups/[groupId]/participants/actions'

export const ParticipantsList = ({
  groupId,
  isOwner,
  isAdmin,
  userId,
  embedded = false
}: {
  groupId: string
  isOwner: boolean
  isAdmin: boolean
  userId: string
  embedded?: boolean
}) => {
  const { mutate } = useSWRConfig()
  const [isLoading, setIsLoading] = useState(false)

  const { data: members, isLoading: isLoadingMembers } = useGetGroupParticipants({ groupId })

  const hasPermission = isOwner || isAdmin
  const count = members?.length ?? 0

  const removeMember = async ({ memberId }: { memberId: string }) => {
    setIsLoading(true)
    try {
      await removeMemberFromGroup(memberId, groupId)
      mutate(['/api/groups/members', groupId])
      mutate(['/api/groups/members-without-admins', groupId])
      mutate(['/api/groups/admins', groupId])
      displayToast('Miembro eliminado correctamente.', 'success')
    } catch (error) {
      displayToast('Hubo un error al eliminar al miembro del grupo.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className={cn('grid w-full min-w-0', embedded ? 'gap-0' : 'gap-3')}>
      <div className={cn(
        'flex items-baseline justify-between gap-4',
        embedded ? 'px-5 pb-3 pt-4' : ''
      )}>
        <h2 className="section-label">Miembros</h2>
        {!isLoadingMembers && (
          <span className="text-xs text-muted-foreground">
            {count} {count === 1 ? 'persona' : 'personas'}
          </span>
        )}
      </div>

      <ul className={cn(
        'divide-y divide-border',
        embedded ? 'border-t border-border' : 'surface-panel'
      )}>
        {isLoadingMembers && (
          <>
            <RowSkeleton embedded={embedded} />
            <RowSkeleton embedded={embedded} />
          </>
        )}

        {!isLoadingMembers && members?.map((member: any) => (
          <li key={member.id} className={cn('flex items-center gap-3', embedded ? 'px-5 py-3' : 'px-4 py-3')}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium">
              {member?.name?.charAt(0)?.toUpperCase() ?? 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{member.name}</p>
              <p className="truncate text-xs text-muted-foreground">{member.email}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {member.id === userId && (
                <span className="text-xs text-muted-foreground">Tú</span>
              )}
              {hasPermission && member.id !== userId && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs text-destructive hover:text-destructive"
                  onClick={() => removeMember({ memberId: member.id })}
                  disabled={isLoading}
                >
                  Eliminar
                </Button>
              )}
            </div>
          </li>
        ))}

        {!isLoadingMembers && count === 0 && (
          <li className={cn('py-8 text-center text-sm text-muted-foreground', embedded ? 'px-5' : 'px-4')}>
            No hay miembros en el grupo
          </li>
        )}
      </ul>
    </section>
  )
}

const RowSkeleton = ({ embedded = false }: { embedded?: boolean }) => (
  <li className={cn('flex items-center gap-3', embedded ? 'px-5 py-3' : 'px-4 py-3')}>
    <Skeleton className="h-9 w-9 rounded-full" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-3 w-40" />
    </div>
  </li>
)

export const ParticipantsListSkeleton = ({ embedded = false }: { embedded?: boolean }) => {
  return (
    <section className={cn('grid w-full min-w-0', embedded ? 'gap-0' : 'gap-3')}>
      <Skeleton className={cn('h-3 w-20', embedded && 'mx-5 mt-4')} />
      <ul className={cn('divide-y divide-border', embedded ? 'border-t border-border' : 'surface-panel')}>
        <RowSkeleton embedded={embedded} />
        <RowSkeleton embedded={embedded} />
      </ul>
    </section>
  )
}
