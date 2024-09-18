import { Logo } from '@/components/logo'
import { NotificationsAmount } from '@/components/notifications-amount'
import { SideNav } from '@/components/side-nav'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { UserNav, UserNavSkeleton } from '@/components/user-nav'
import { Menu } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

export default async function RootLayout ({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-lg font-semibold md:text-base"
            >
              <Logo />
              <span className="sr-only">Split Group</span>
            </Link>

            <NotificationsAmount />
          </div>
          <div className="flex-1">
            <SideNav />
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          {/* Mobile */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Alternar navegación</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <Logo />
                <span className="sr-only">Split Group</span>
              </Link>

              <SideNav />
            </SheetContent>
          </Sheet>

          <ThemeSwitcher />

          <Suspense fallback={<UserNavSkeleton />}>
            <UserNav className='ml-auto' />
          </Suspense>
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
