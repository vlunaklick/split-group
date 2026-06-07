import { Suspense } from 'react'
import { ThemeSwitcher } from './theme-switcher'
import { UserNav, UserNavSkeleton } from './user-nav'
import { SidebarTrigger } from './ui/sidebar'

export function Header () {
  return (
    <header className="flex h-16 items-center gap-4 border-b border-border bg-background px-4 lg:px-6">
      <SidebarTrigger className="-ml-1 h-4 w-4" />

      <ThemeSwitcher />

      <Suspense fallback={<UserNavSkeleton />}>
        <UserNav className='ml-auto' />
      </Suspense>
    </header>
  )
}
