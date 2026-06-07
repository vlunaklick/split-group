'use client'

import { useGetUserGroups } from '@/data/groups'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenuButton, SidebarMenuItem, SidebarMenuSkeleton, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from './ui/sidebar'
import { usePathname } from 'next/navigation'
import { Icon } from './group-icons'

const groupTabs = (groupId: string) => [
  { href: `/groups/${groupId}`, label: 'Resumen', exact: true },
  { href: `/groups/${groupId}/spendings`, label: 'Gastos', exact: false },
  { href: `/groups/${groupId}/participants`, label: 'Participantes', exact: false }
]

export const SideGroupNav = () => {
  const { data: groups, isLoading } = useGetUserGroups()
  const path = usePathname()

  const activeGroupId = path.match(/^\/groups\/([^/]+)/)?.[1]

  const isGroupActive = (groupId: string) => path.startsWith(`/groups/${groupId}`)

  const isTabActive = (href: string, exact: boolean) => {
    if (exact) return path === href
    return path.startsWith(href)
  }

  return (
    <SidebarGroup title='Grupos'>
      <SidebarGroupLabel>Grupos</SidebarGroupLabel>
      <SidebarGroupContent className='list-none gap-2 flex flex-col'>
        {isLoading && <GroupSkeleton />}

        {groups?.map((group: any) => (
          <SidebarMenuItem key={group.id}>
            <SidebarMenuButton isActive={isGroupActive(group.id)} asChild tooltip={group.name}>
              <Link href={`/groups/${group.id}`} className='border-muted flex items-center gap-2'>
                <div className='h-4 w-4 rounded-full flex items-center justify-center'>
                  <Icon type={group.icon} />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {group.name}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>

            {activeGroupId === group.id && (
              <SidebarMenuSub>
                {groupTabs(group.id).map((tab) => (
                  <SidebarMenuSubItem key={tab.href}>
                    <SidebarMenuSubButton asChild isActive={isTabActive(tab.href, tab.exact)}>
                      <Link
                        href={tab.href}
                        className={cn(isTabActive(tab.href, tab.exact) && 'font-medium text-foreground')}
                      >
                        {tab.label}
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            )}
          </SidebarMenuItem>
        ))}
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

const GroupSkeleton = () => {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <SidebarMenuItem key={index}>
          <SidebarMenuSkeleton />
        </SidebarMenuItem>
      ))}
    </>
  )
}
