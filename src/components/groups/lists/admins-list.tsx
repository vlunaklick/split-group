'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetGroupAdmins } from '@/data/groups'
import { GiveAdminDialog } from '../dialogs/give-admin-dialog'
import { RemoveAdminForm } from '../forms/remove-admin-form'

export function AdminsList ({ groupId, userId, isOwner }: { groupId: string, userId: string, isOwner: boolean }) {
  const { data: admins, isLoading: isLoadingAdmins } = useGetGroupAdmins({ groupId })

  return (
    <Card className='md:max-w-[526px] w-full h-max'>
      <CardHeader className='flex items-center gap-4 flex-row justify-between'>
        <div className='flex flex-col space-y-1.5'>
          <CardTitle>Administradores</CardTitle>
          <CardDescription>Listado de administradores del grupo</CardDescription>
        </div>
        {isOwner && (
          <GiveAdminDialog groupId={groupId} />
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
            <Avatar>
              <AvatarFallback>{admin.name.charAt(0) ?? 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className='text-lg font-semibold'>{admin.name}</h2>
              <p className='text-sm text-muted-foreground/60'>{admin.email}</p>
            </div>
            <div className='ml-auto'>
              {admin.id === userId && (
                <span className='text-sm text-muted-foreground/60'>Tú</span>
              )}
              {admin.id !== userId && isOwner && (
                <RemoveAdminForm userId={admin.id} groupId={groupId} />
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
      <Skeleton className='h-12 w-12' />
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
