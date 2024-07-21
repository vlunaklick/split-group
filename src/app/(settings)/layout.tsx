import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Logo } from '@/components/logo'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { SettingsNav } from './nav'
import { UserNav } from '@/components/user-nav'
import { Menu } from 'lucide-react'
import { SideNav } from '@/components/side-nav'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function RootLayout ({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions)

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b dark:border-zinc-800 dark:bg-zinc-950 px-4 md:px-6 bg-white">
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

        <UserNav className='ml-auto' />
      </header>
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl font-semibold">Configuración</h1>
        </div>
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <SettingsNav />

          <div className="grid gap-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
