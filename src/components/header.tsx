import { Suspense } from 'react'
import { ThemeSwitcher } from './theme-switcher'
import { UserNav, UserNavSkeleton } from './user-nav'
import { SidebarTrigger } from './ui/sidebar'

export function Header () {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <SidebarTrigger className="-ml-1 h-4 w-4" />

      <ThemeSwitcher />

      <Suspense fallback={<UserNavSkeleton />}>
        <UserNav className='ml-auto' />
      </Suspense>
    </header>
  )
}
