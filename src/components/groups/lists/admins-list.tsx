'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useGetGroupAdmins } from '@/data/groups'
import { GiveAdminDialog } from '../dialogs/give-admin-dialog'
import { RemoveAdminForm } from '../forms/remove-admin-form'

export function AdminsList ({
  groupId,
  userId,
  isOwner,
  embedded = false
}: {
  groupId: string
  userId: string
  isOwner: boolean
  embedded?: boolean
}) {
  const { data: admins, isLoading: isLoadingAdmins } = useGetGroupAdmins({ groupId })
  const count = admins?.length ?? 0

  return (
    <section className={cn('grid w-full min-w-0', embedded ? 'gap-0 border-t border-border' : 'gap-3')}>
      <div className={cn(
        'flex items-center justify-between gap-4',
        embedded ? 'px-5 pb-3 pt-4' : ''
      )}>
        <h2 className="section-label">Administradores</h2>
        {isOwner && <GiveAdminDialog groupId={groupId} />}
      </div>

      <ul className={cn(
        'divide-y divide-border',
        embedded ? 'border-t border-border' : 'surface-panel'
      )}>
        {isLoadingAdmins && (
          <>
            <RowSkeleton embedded={embedded} />
            <RowSkeleton embedded={embedded} />
          </>
        )}

        {admins?.map((admin: any) => (
          <li key={admin.id} className={cn('flex items-center gap-3', embedded ? 'px-5 py-3' : 'px-4 py-3')}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium">
              {admin.name?.charAt(0)?.toUpperCase() ?? 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{admin.name}</p>
              <p className="truncate text-xs text-muted-foreground">{admin.email}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {admin.id === userId && (
                <span className="text-xs text-muted-foreground">Tú</span>
              )}
              {admin.id !== userId && isOwner && (
                <RemoveAdminForm userId={admin.id} groupId={groupId} />
              )}
            </div>
          </li>
        ))}

        {!isLoadingAdmins && count === 0 && (
          <li className={cn('py-8 text-center text-sm text-muted-foreground', embedded ? 'px-5' : 'px-4')}>
            Sin administradores asignados
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

export const AdminsListSkeleton = ({ embedded = false }: { embedded?: boolean }) => {
  return (
    <section className={cn('grid w-full min-w-0', embedded ? 'gap-0 border-t border-border' : 'gap-3')}>
      <Skeleton className={cn('h-3 w-28', embedded && 'mx-5 mt-4')} />
      <ul className={cn('divide-y divide-border', embedded ? 'border-t border-border' : 'surface-panel')}>
        <RowSkeleton embedded={embedded} />
        <RowSkeleton embedded={embedded} />
      </ul>
    </section>
  )
}
