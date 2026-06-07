import { IconLayoutDashboard } from '@tabler/icons-react'
import Link from 'next/link'
import { Logo } from './logo'
import { NotificationsAmount } from './notifications-amount'
import { SideGroupNav } from './side-nav'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar'
import { CreateGroupSheet } from './groups/sheets/create-group-sheet'

export function AppSidebar () {
  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className='hover:bg-transparent bg-transparent active:bg-transparent focus-visible:ring-2 ring-transparent'
            >
              <Link className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground" href="/dashboard">
                <Logo />
              </Link>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  Split Group
                </span>
              </div>
              <NotificationsAmount />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup title='General'>
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Panel" asChild>
                  <Link href="/dashboard">
                    <IconLayoutDashboard className="h-4 w-4" />
                    <span>Inicio</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Crear grupo" asChild>
                  <CreateGroupSheet />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SideGroupNav />
      </SidebarContent>
    </Sidebar>
  )
}
