import { ThemeSwitcher } from '../theme-switcher'
import { MainNav } from './main-nav'
import Link from 'next/link'
import { Button, buttonVariants } from '../ui/button'
import { Logo } from '../logo'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
import { cn } from '@/lib/utils'

export function SiteHeader () {
  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b dark:border-zinc-800 px-4 md:px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Link
        href="/dashboard"
        className="hidden md:flex items-center gap-2 text-lg font-semibold"
      >
        <Logo />
        <span className="sr-only">Split Group</span>
      </Link>

      <Link href="/calculator" className="hidden lg:flex lg:items-center lg:gap-6 text-sm">
        Calculadora
      </Link>

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
          {/* <SideNav userId={session?.user.id as string} /> */}
        </SheetContent>
      </Sheet>

      <Link href="/login" className={cn(
        buttonVariants({ variant: 'default' }),
        'ml-auto'
      )}>
        Iniciar sesión
      </Link>
    </header>
  )
}
