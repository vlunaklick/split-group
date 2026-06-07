import { IconLayoutDashboard } from '@tabler/icons-react'
import Link from 'next/link'
import { Logo } from './logo'
import { NotificationsAmount } from './notifications-amount'
import { SideGroupNav } from './side-nav'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar'
import { CreateGroupSheet } from './groups/sheets/create-group-sheet'

export function AppSidebar () {
  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-0.5">
            <SidebarMenuButton
              size="lg"
              className="min-w-0 flex-1 hover:bg-sidebar-accent/60 bg-transparent active:bg-transparent"
              asChild
            >
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="flex aspect-square size-8 items-center justify-center">
                  <Logo />
                </div>
                <span className="truncate font-medium">Split Group</span>
              </Link>
            </SidebarMenuButton>
            <div className="group-data-[collapsible=icon]:hidden">
              <NotificationsAmount />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Inicio" asChild>
                  <Link href="/dashboard">
                    <IconLayoutDashboard className="h-4 w-4" />
                    <span>Inicio</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <CreateGroupSheet className="w-full justify-start bg-transparent shadow-none hover:bg-sidebar-accent/60" />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SideGroupNav />
      </SidebarContent>
    </Sidebar>
  )
}
