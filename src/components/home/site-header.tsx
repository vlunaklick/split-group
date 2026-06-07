'use client'

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'
import { Menu } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from '../logo'
import { ThemeSwitcher } from '../theme-switcher'
import { Button, buttonVariants } from '../ui/button'

export function SiteHeader () {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background px-4 md:px-6">
      <Link href="/" className="mr-6 hidden items-center space-x-2 md:flex">
        <Logo />
        <span className="hidden text-sm font-medium sm:inline-block">
          {siteConfig.name}
        </span>
      </Link>

      <nav className="hidden items-center gap-6 md:flex">
        <NavLink href="/#como-funciona" active={false}>
          Cómo funciona
        </NavLink>
        <NavLink href="/#app-en-accion" active={false}>
          La app
        </NavLink>
        <NavLink href="/#funcionalidades" active={false}>
          Funcionalidades
        </NavLink>
        <NavLink href="/calculator" active={pathname === '/calculator'}>
          Calculadora
        </NavLink>
      </nav>

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
        <SheetContent side="left" className="flex flex-col bg-background">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-medium"
          >
            <Logo />
            <span>{siteConfig.name}</span>
          </Link>
          <nav className="grid items-start space-y-2 px-2 text-sm font-medium">
            <NavLink href="/#como-funciona" active={false}>
              Cómo funciona
            </NavLink>
            <NavLink href="/#app-en-accion" active={false}>
              La app
            </NavLink>
            <NavLink href="/#funcionalidades" active={false}>
              Funcionalidades
            </NavLink>
            <NavLink href="/calculator" active={pathname === '/calculator'}>
              Calculadora
            </NavLink>
          </nav>
          <div className="mt-auto border-t border-border pt-4">
            <ThemeSwitcher />
          </div>
        </SheetContent>
      </Sheet>

      <div className="ml-auto flex items-center gap-4">
        <Link href="/login" className={buttonVariants({ variant: 'default' })}>
          Iniciar sesión
        </Link>
        <ThemeSwitcher />
      </div>
    </header>
  )
}

function NavLink ({
  href,
  children,
  active
}: {
  href: string
  children: React.ReactNode
  active?: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        'text-sm font-medium transition-colors hover:text-foreground',
        active ? 'text-foreground' : 'text-muted-foreground'
      )}
    >
      {children}
    </Link>
  )
}
