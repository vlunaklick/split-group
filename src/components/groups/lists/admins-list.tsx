'use client'

import { giveAdminPermission, removeAdminPermission } from '@/app/(overview)/groups/[groupId]/participants/actions'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DialogHeader } from '@/components/ui/dialog'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetGroupAdmins, useGetMembersWithoutAdministrator } from '@/data/groups'
import { giveAdminPermissionSchema } from '@/lib/form'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@radix-ui/react-dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select'
import { IconCrown, IconLoader2 } from '@tabler/icons-react'
import { useState } from 'react'
import { Form, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useSWRConfig } from 'swr'
import { z } from 'zod'

// TODO: Sacar el dialog y form en otros dos componentes, también agregar el componente AVATAR

export function AdminsList ({ groupId, userId, isOwner }: { groupId: string, userId: string, isOwner: boolean }) {
  const { data: admins, isLoading: isLoadingAdmins } = useGetGroupAdmins({ groupId })

  const { data: membersWithoutAdmins, isLoading: isLoadingMembersWithoutAdmin } = useGetMembersWithoutAdministrator({ groupId })

  const [isLoading, setIsLoading] = useState(false)
  const { mutate } = useSWRConfig()

  const form = useForm<z.infer<typeof giveAdminPermissionSchema>>({
    resolver: zodResolver(giveAdminPermissionSchema),
    values: {
      userId: ''
    }
  })

  const hasPermission = isOwner

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
        {hasPermission && (
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
                            membersWithoutAdmins.map((member: any) => (
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
        )}
      </CardHeader>
      <CardContent className='space-y-4'>
        {isLoadingAdmins && (
          <>
            <RowSkeleton />
            <RowSkeleton />
            <RowSkeleton />
          </>
        )}

        {admins?.map((admin: any) => (
          <div key={admin.id} className='flex items-center gap-4'>
            <div className={cn(buttonVariants({ variant: 'secondary', size: 'icon' }), 'rounded-full')}>
              {admin?.name?.charAt(0) ?? 'U'}
            </div>
            <div>
              <h2 className='text-lg font-semibold'>{admin.name}</h2>
              <p className='text-sm text-muted-foreground/60'>{admin.email}</p>
            </div>
            <div className='ml-auto'>
              {admin.id === userId && (
                <span className='text-sm text-muted-foreground/60'>Tú</span>
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
      <div className={cn(buttonVariants({ variant: 'secondary', size: 'icon' }), 'rounded-full bg-zinc-200')} />
      <div className='flex gap-2 flex-1 flex-col'>
        <Skeleton className='h-6 w-1/2' />
        <Skeleton className='h-4 w-1/4' />
      </div>
    </div>
  )
}

export const AdminsListSkeleton = () => {
  return (
    <Card className='md:max-w-[526px] w-full'>
      <CardHeader>
        <CardTitle>Administradores</CardTitle>
        <CardDescription>Listado de administradores del grupo</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <RowSkeleton />
        <RowSkeleton />
        <RowSkeleton />
      </CardContent>
    </Card>
  )
}
