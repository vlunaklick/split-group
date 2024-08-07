'use client'

import { Button, buttonVariants } from '@/components/ui/button'
import { hasGroupAdminPermission } from '@/lib/data'
import { cn } from '@/lib/utils'
import { IconSettings, IconUsersGroup } from '@tabler/icons-react'
import Link from 'next/link'
import useSWR from 'swr'

export const HeaderButtons = ({ groupId, userId }: { groupId: string, userId: string }) => {
  const { data: hasPermission } = useSWR(['user-group-admin-permission', userId, groupId], async ([url, userId, groupId]) => {
    return await hasGroupAdminPermission(userId, groupId)
  })

  return (
    <>
      <Link href={`/groups/${groupId}/participants`} className={cn(buttonVariants({ variant: 'outline' }), 'md:inline hidden')}>
        Participantes
      </Link>
      <Button variant="outline">
        Exportar
      </Button>

      {hasPermission && (
        <Link href={`/groups/${groupId}/settings`} className={cn(buttonVariants({ variant: 'outline', size: 'icon' }), 'hidden md:flex')}>
          <IconSettings />
        </Link>
      )}
    </>
  )
}

export const HeaderButtonsMobile = ({ groupId, userId }: { groupId: string, userId: string }) => {
  const { data: hasPermission } = useSWR(['user-group-admin-permission', userId, groupId], async ([url, userId, groupId]) => {
    return await hasGroupAdminPermission(userId, groupId)
  })

  return (
    <div className="flex gap-2 md:hidden">
      <Link href={`/groups/${groupId}/participants`} className={cn(buttonVariants({ variant: 'outline', size: 'icon' }))}>
        <IconUsersGroup />
      </Link>

      {hasPermission && (
        <Link href={`/groups/${groupId}/settings`} className={cn(buttonVariants({ variant: 'outline', size: 'icon' }))}>
          <IconSettings />
        </Link>
      )}
    </div>
  )
}
