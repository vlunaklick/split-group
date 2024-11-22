'use client'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetGroupParticipnts } from '@/data/groups'
import { cn } from '@/lib/utils'
import { displayToast } from '@/utils/toast-display'
import { useState } from 'react'
import { useSWRConfig } from 'swr'
import { removeMemberFromGroup } from '../../../app/(overview)/groups/[groupId]/participants/actions'

export const ParticipantsList = ({ groupId, isOwner, isAdmin, userId }: { groupId: string, isOwner: boolean, isAdmin: boolean, userId: string }) => {
  const { mutate } = useSWRConfig()
  const [isLoading, setIsLoading] = useState(false)

  const { data: members, isLoading: isLoadingMembers } = useGetGroupParticipnts({ groupId })

  const hasPermission = isOwner || isAdmin

  const removeMember = async ({ memberId }: { memberId: string }) => {
    setIsLoading(true)
    try {
      await removeMemberFromGroup(memberId, groupId)
      mutate(['/api/groups/members', groupId])
      mutate(['/api/groups/members-without-admins', groupId])
      mutate(['/api/groups/admins', groupId])
    } catch (error) {
      displayToast('Hubo un error al eliminar al miembro del grupo.', 'error')
      return
    }

    displayToast('Miembro eliminado correctamente.', 'success')
    setIsLoading(false)
  }

  return (
    <Card className='md:max-w-[526px] w-full'>
      <CardHeader>
        <CardTitle>Miembros</CardTitle>
        <CardDescription>Listado de miembros del grupo</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        {isLoadingMembers && (
          <>
            <RowSkeleton />
            <RowSkeleton />
            <RowSkeleton />
          </>
        )}
        {members?.map((member: any) => (
          <div key={member.id} className='flex items-center gap-4'>
            <div className={cn(buttonVariants({ variant: 'secondary', size: 'icon' }), 'rounded-full')}>
              {member?.name?.charAt(0) ?? 'U'}
            </div>
            <div>
              <h2 className='text-lg font-semibold'>{member.name}</h2>
              <p className='text-sm text-muted-foreground/60'>{member.email}</p>
            </div>
            <div className='ml-auto flex gap-4 items-center'>
              {member.id === userId && (
                <span className='text-sm text-muted-foreground/60'>Tú</span>
              )}

              {hasPermission && member.id !== userId && (
                <Button variant='outline' onClick={() => removeMember({ memberId: member.id })} disabled={isLoading}>Eliminar</Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

const RowSkeleton = () => {
  return (
    <div className='flex items-center gap-4 animate-pulse'>
      <div className={cn(buttonVariants({ variant: 'secondary', size: 'icon' }), 'rounded-full bg-zinc-200')} />
      <div className='flex gap-2 flex-1 flex-col'>
        <Skeleton className='h-6 w-1/2' />
        <Skeleton className='h-4 w-1/4' />
      </div>
    </div>
  )
}

export const ParticipantsListSkeleton = () => {
  return (
    <Card className='md:max-w-[526px] w-full'>
      <CardHeader>
        <CardTitle>Miembros</CardTitle>
        <CardDescription>Listado de miembros del grupo</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <RowSkeleton />
        <RowSkeleton />
        <RowSkeleton />
      </CardContent>
    </Card>
  )
}
