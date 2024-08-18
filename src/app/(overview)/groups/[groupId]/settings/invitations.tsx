'use client'

import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetInvitationLink, useGetUsersInvitedToGroup } from '@/data/groups'
import { cn } from '@/lib/utils'
import { IconClipboard } from '@tabler/icons-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useSWRConfig } from 'swr'
import { removeInvitationLink, removeUserInvitation } from './actions'

export const UsersInvited = ({ groupId, userId }: { groupId: string, userId: string }) => {
  const [isLoading, setIsLoading] = useState(false)
  const { mutate } = useSWRConfig()

  const { data: invitations, isLoading: isLoadingMembers } = useGetUsersInvitedToGroup({ groupId })

  const onRemove = async (userId: string) => {
    setIsLoading(true)
    try {
      await removeUserInvitation(userId, groupId)
      mutate(['/api/groups/members/invited', groupId])
    } catch (error) {
      toast.error('Hubo un error al enviar la invitación al miembro.', {
        duration: 3000
      })
      return
    }

    toast.success('Invitación eliminada correctamente.', {
      duration: 3000
    })
    setIsLoading(false)
  }

  return (
    <Card className='md:max-w-[526px] w-full'>
      <CardHeader>
        <CardTitle>Miembros invitados</CardTitle>
        <CardDescription>
          Estos son los miembros que has invitado a unirse a este grupo.
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        {isLoadingMembers && (
          <>
            <RowSkeleton />
            <RowSkeleton />
            <RowSkeleton />
          </>
        )}
        {invitations?.length === 0 && (
          <p className='text-sm text-muted-foreground/50'>No has invitado a ningún miembro a unirse a este grupo.</p>
        )}
        {invitations?.map(invitation => (
          <div key={invitation.user.id} className='flex items-center gap-4'>
            <div className={cn(buttonVariants({ variant: 'secondary', size: 'icon' }), 'rounded-full')}>
              {invitation.user.name?.charAt(0) ?? 'U'}
            </div>
            <div>
              <h2 className='text-lg font-semibold'>{invitation.user.name}</h2>
              <p className='text-sm text-muted-foreground'>{invitation.user.email}</p>
            </div>
            <div className='ml-auto'>
              <Button variant='outline' onClick={() => onRemove(invitation.user.id)} disabled={isLoading}>Eliminar</Button>
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

export const LinksGenerated = ({ groupId, userId }: { groupId: string, userId: string }) => {
  const [isLoading, setIsLoading] = useState(false)
  const { mutate } = useSWRConfig()

  const { data: invitations, isLoading: isLoadingMembers } = useGetInvitationLink({ groupId })

  const onRemove = async (code: string) => {
    setIsLoading(true)
    try {
      await removeInvitationLink(code)
      mutate(['/api/groups/link', groupId])
    } catch (error) {
      toast.error('Hubo un error al enviar la invitación al miembro.', {
        duration: 3000
      })
      return
    }

    toast.success('Invitación eliminada correctamente.', {
      duration: 3000
    })
    setIsLoading(false)
  }

  const onCopy = async (code: string) => {
    try {
      const url = `${window.location.origin}/join/${code}`
      await navigator.clipboard.writeText(url)
      toast.success('Enlace copiado al portapapeles.', {
        duration: 3000
      })
    } catch (error) {
      toast.error('Hubo un error al copiar el enlace al portapapeles.', {
        duration: 3000
      })
    }
  }

  return (
    <Card className='md:max-w-[526px] w-full h-min'>
      <CardHeader>
        <CardTitle>Enlaces de invitación generados</CardTitle>
        <CardDescription>
          Estos son los enlaces de invitación que has generado para que otros miembros se unan a este grupo
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        {isLoadingMembers && (
          <>
            <RowSkeleton />
            <RowSkeleton />
            <RowSkeleton />
          </>
        )}
        {invitations?.length === 0 && (
          <p className='text-sm text-muted-foreground/50'>No has generado ningún enlace de invitación para este grupo.</p>
        )}

        {invitations?.map(invitation => (
          <div key={invitation.code} className='flex items-center gap-4'>
            <p className='text-base font-semibold truncate'>
              {invitation.code.slice(0, 4)}
              ...
              {invitation.code.slice(-4)}
            </p>

            <p className='text-sm text-muted-foreground'>{invitation.uses} usos de {invitation.maxUses}</p>

            <div className='ml-auto flex gap-4 items-center'>
              <Button variant='outline' size='icon' onClick={() => onCopy(invitation.code)} disabled={isLoading}>
                <IconClipboard />
              </Button>

              <Button variant='outline' onClick={() => onRemove(invitation.code)} disabled={isLoading}>Eliminar</Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
