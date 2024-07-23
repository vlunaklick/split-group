'use client'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getGroupAdmins, getGroupParticipants, getMembersWithoutAdministrator, giveAdminPermission, hasGroupAdminPermission, hasGroupOwnerPermission, removeAdminPermission, removeMemberFromGroup } from '@/lib/data'
import { cn } from '@/lib/utils'
import useSWR, { useSWRConfig } from 'swr'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { IconCrown, IconLoader2 } from '@tabler/icons-react'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { giveAdminPermissionSchema } from '@/lib/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

export const ParticipantsList = ({ groupId, userId }: { groupId: string, userId: string }) => {
  const { mutate } = useSWRConfig()
  const [isLoading, setIsLoading] = useState(false)

  const { data: members, isLoading: isLoadingMembers } = useSWR(['/api/groups/members', groupId], async ([url, groupId]) => {
    return await getGroupParticipants(groupId)
  })
  const { data: hasPermission } = useSWR(['/api/groups/permissions', groupId, userId], async ([url, groupId, userId]) => {
    return await hasGroupAdminPermission(userId, groupId)
  })

  const isOwner = hasPermission && members?.find(member => member.id === userId)?.isOwner

  const removeMember = async (userId: string) => {
    setIsLoading(true)
    try {
      await removeMemberFromGroup(userId, groupId)
      mutate(['/api/groups/members', groupId])
      mutate(['/api/groups/members-without-admins', groupId])
      mutate(['/api/groups/admins', groupId])
    } catch (error) {
      toast.error('Hubo un error al eliminar al miembro del grupo.', {
        duration: 3000
      })
      return
    }

    toast.success('Miembro eliminado correctamente.', {
      duration: 3000
    })
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
        {members?.map(member => (
          <div key={member.id} className='flex items-center gap-4'>
            <div className={cn(buttonVariants({ variant: 'secondary', size: 'icon' }), 'rounded-full')}>
              {member?.name?.charAt(0) ?? 'U'}
            </div>
            <div>
              <h2 className='text-lg font-semibold'>{member.name}</h2>
              <p className='text-sm text-gray-500'>{member.email}</p>
            </div>
            <div className='ml-auto'>
              {member.id === userId && (
                <span className='text-sm text-gray-500'>Tú</span>
              )}
              {((isOwner && member.id !== userId) || ((hasPermission && member.id !== userId && !member.isAdmin && !member.isOwner))) && (
                <Button variant='outline' onClick={() => removeMember(member.id)} disabled={isLoading}>Eliminar</Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export const AdminsList = ({ groupId, userId }: { groupId: string, userId: string }) => {
  const { data: admins, isLoading: isLoadingAdmins } = useSWR(['/api/groups/admins', groupId], async ([url, groupId]) => {
    return await getGroupAdmins(groupId)
  })
  const { data: hasPermission } = useSWR(['/api/groups/permissions/owner', groupId, userId], async ([url, groupId, userId]) => {
    return await hasGroupOwnerPermission(userId, groupId)
  })
  const { data: membersWithoutAdmins, isLoading: isLoadingMembersWithoutAdmin } = useSWR(['/api/groups/members-without-admins', groupId], async ([url, groupId]) => {
    return await getMembersWithoutAdministrator(groupId)
  })
  const [isLoading, setIsLoading] = useState(false)
  const { mutate } = useSWRConfig()

  const form = useForm<z.infer<typeof giveAdminPermissionSchema>>({
    resolver: zodResolver(giveAdminPermissionSchema),
    values: {
      userId: ''
    }
  })

  const onSubmit = async (values: z.infer<typeof giveAdminPermissionSchema>) => {
    setIsLoading(true)
    try {
      await giveAdminPermission(values.userId, groupId)
      mutate(['/api/groups/admins', groupId])
      mutate(['/api/groups/members-without-admins', groupId])
    } catch (error) {
      toast.error('Hubo un error al otorgar permisos de administrador.', {
        duration: 3000
      })
      setIsLoading(false)
      return
    }

    toast.success('Permisos de administrador otorgados correctamente.', {
      duration: 3000
    })
    setIsLoading(false)
  }

  const revokeAdminPermission = async (userId: string) => {
    setIsLoading(true)
    try {
      await removeAdminPermission(userId, groupId)
      mutate(['/api/groups/admins', groupId])
      mutate(['/api/groups/members-without-admins', groupId])
    } catch (error) {
      toast.error('Hubo un error al remover permisos de administrador.', {
        duration: 3000
      })
      return
    }

    toast.success('Permisos de administrador removidos correctamente.', {
      duration: 3000
    })
    setIsLoading(false)
  }

  return (
    <Card className='md:max-w-[526px] w-full'>
      <CardHeader className='flex items-center gap-4 flex-row justify-between'>
        <div className='flex flex-col space-y-1.5'>
          <CardTitle>Administradores</CardTitle>
          <CardDescription>Listado de administradores del grupo</CardDescription>
        </div>
        {
          hasPermission && (
            <Dialog>
              <DialogTrigger asChild disabled={isLoading || isLoadingAdmins || isLoadingMembersWithoutAdmin}>
                <Button variant='outline' size='icon'>
                  <IconCrown />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Otorgar permisos de administrador</DialogTitle>
                  <DialogDescription>
                    Selecciona un miembro para otorgarle permisos de administrador.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                      control={form.control}
                      name="userId"
                      render={({ field }) => (
                        <FormItem>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger disabled={isLoading || isLoadingAdmins || isLoadingMembersWithoutAdmin || membersWithoutAdmins?.length === 0}>
                                <SelectValue placeholder={isLoadingMembersWithoutAdmin ? 'Cargando miembros...' : membersWithoutAdmins?.length === 0 ? 'No hay miembros disponibles' : 'Selecciona un miembro'} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {membersWithoutAdmins && membersWithoutAdmins?.length > 0 && (
                              membersWithoutAdmins.map(member => (
                                    <SelectItem key={member.id} value={member.id}>
                                      @{member.username}
                                    </SelectItem>
                              ))
                            )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className='mt-2' disabled={isLoading || isLoadingAdmins || isLoadingMembersWithoutAdmin || membersWithoutAdmins?.length === 0}>
                      {isLoading ? <IconLoader2 className='animate-spin' /> : 'Otorgar permisos'}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          )
        }
      </CardHeader>
      <CardContent className='space-y-4'>
        {isLoadingAdmins && (
          <>
            <RowSkeleton />
            <RowSkeleton />
            <RowSkeleton />
          </>
        )}
        {admins?.map(admin => (
          <div key={admin.id} className='flex items-center gap-4'>
            <div className={cn(buttonVariants({ variant: 'secondary', size: 'icon' }), 'rounded-full')}>
              {admin?.name?.charAt(0) ?? 'U'}
            </div>
            <div>
              <h2 className='text-lg font-semibold'>{admin.name}</h2>
              <p className='text-sm text-gray-500'>{admin.email}</p>
            </div>
            <div className='ml-auto'>
              {admin.id === userId && (
                <span className='text-sm text-gray-500'>Tú</span>
              )}
              {admin.id !== userId && hasPermission && (
                <Button variant='outline' onClick={() => revokeAdminPermission(admin.id)} disabled={isLoading}>Remover</Button>
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
      <div className={cn(buttonVariants({ variant: 'secondary', size: 'icon' }), 'rounded-full bg-gray-200')} />
      <div className='flex gap-2 flex-1 flex-col'>
        <Skeleton className='h-6 w-1/2' />
        <Skeleton className='h-4 w-1/4' />
      </div>
    </div>
  )
}
