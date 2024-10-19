'use client'

import { useGetUserGroups } from '@/data/groups'
import Link from 'next/link'
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenuButton, SidebarMenuItem, SidebarMenuSkeleton } from './ui/sidebar'
import { usePathname } from 'next/navigation'
import { Icon } from './group-icons'

export const SideGroupNav = () => {
  const { data: groups, isLoading } = useGetUserGroups()
  const path = usePathname()

  const selectedPath = (href: string) => {
    return path.startsWith(href)
  }

  return (
    <SidebarGroup title='Grupos'>
      <SidebarGroupLabel>Grupos</SidebarGroupLabel>
      <SidebarGroupContent className='list-none gap-2 flex flex-col'>
        {isLoading && <GroupSkeleton />}

        {groups?.map((group: any) => (
          <SidebarMenuItem key={group.id}>
            <SidebarMenuButton isActive={selectedPath(`/groups/${group.id}`)} asChild tooltip={group.name}>
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
