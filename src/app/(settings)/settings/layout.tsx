import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { CircleUser, Menu } from 'lucide-react'
import Link from 'next/link'
import { SettingsNav } from './nav'
import { Logo } from '@/components/logo'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

export default function RootLayout ({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b dark:border-zinc-800 dark:bg-zinc-950 px-4 md:px-6 bg-white">
        <nav className="flex-col gap-6 text-lg font-medium hidden md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <Logo />
            <span className="sr-only">Split Group</span>
          </Link>
        </nav>
        {
          // TODO: update with the correct menu information
        }
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
          <SheetContent side="left" className='border-zinc-800'>
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="#"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <Logo />
                <span className="sr-only">Split Group</span>
              </Link>
              <Link
                href="#"
                className="text-zinc-400 hover:text-foreground"
              >
                Dashboard
              </Link>
              <Link
                href="#"
                className="text-zinc-400 hover:text-foreground"
              >
                Orders
              </Link>
              <Link
                href="#"
                className="text-zinc-400 hover:text-foreground"
              >
                Products
              </Link>
              <Link
                href="#"
                className="text-zinc-400 hover:text-foreground"
              >
                Customers
              </Link>
              <Link href="#" className="hover:text-foreground">
                Settings
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full ml-auto">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
