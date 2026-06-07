import { Suspense } from 'react'
import { ThemeSwitcher } from './theme-switcher'
import { UserNav, UserNavSkeleton } from './user-nav'
import { SidebarTrigger } from './ui/sidebar'

export function Header () {
  return (
    <header className="flex h-14 items-center gap-2 border-b border-border/80 bg-background px-4 lg:px-8">
      <SidebarTrigger className="-ml-1" />

      <Suspense fallback={<UserNavSkeleton />}>
        <UserNav className="ml-auto" />
      </Suspense>

      <ThemeSwitcher className="text-muted-foreground" />
    </header>
  )
}
