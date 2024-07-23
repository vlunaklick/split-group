import Link from 'next/link'
import { Bell, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Logo } from '@/components/logo'
import { UserNav } from '@/components/user-nav'
import { SideNav } from '@/components/side-nav'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export default async function RootLayout ({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions)

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block dark:border-zinc-800">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] dark:border-zinc-800 lg:px-6">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-lg font-semibold md:text-base"
            >
              <Logo />
              <span className="sr-only">Split Group</span>
            </Link>
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>
          <div className="flex-1">
            <SideNav userId={session?.user.id as string} />
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b dark:border-zinc-800 bg-muted/40 px-4 lg:h-[60px] lg:px-6">
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
            <SheetContent side="left" className="flex flex-col dark:border-zinc-800">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <Logo />
                <span className="sr-only">Split Group</span>
              </Link>
              <SideNav userId={session?.user.id as string} />
            </SheetContent>
          </Sheet>

          <UserNav className="ml-auto" />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
