import { Suspense } from 'react'
import { CommandPalette } from './command-palette'
import { ThemeSwitcher } from './theme-switcher'
import { UserNav, UserNavSkeleton } from './user-nav'
import { SidebarTrigger } from './ui/sidebar'

export function Header () {
  return (
    <header className="flex h-14 min-w-0 items-center gap-2 overflow-hidden border-b border-border/80 bg-background px-4 lg:px-8">
      <SidebarTrigger className="-ml-1" />
      <CommandPalette />

      <Suspense fallback={<UserNavSkeleton />}>
        <UserNav className="ml-auto" />
      </Suspense>

      <ThemeSwitcher className="text-muted-foreground" />
    </header>
  )
}
