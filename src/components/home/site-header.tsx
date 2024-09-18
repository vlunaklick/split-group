'use client'

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'
import { Menu } from 'lucide-react'
import Link from 'next/link'
import { Logo } from '../logo'
import { ThemeSwitcher } from '../theme-switcher'
import { Button, buttonVariants } from '../ui/button'

export function SiteHeader () {
  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b px-4 md:px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-30">
      <Link href="/" className="mr-6 items-center space-x-2 hidden md:flex">
        <Logo />

        <span className="hidden font-bold sm:inline-block">
          {siteConfig.name}
        </span>
      </Link>

      {/* <Link href="/calculator" className={cn('transition-colors hover:text-foreground/80 text-sm hidden md:block',
        pathname === '/calculator' ? 'text-foreground' : 'text-foreground/60'
      )}>
        Calculadora
      </Link> */}

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
            href="/"
            className="flex items-center gap-2 text-lg font-semibold"
          >
            <Logo />
            <span className="sr-only">Split Group</span>
          </Link>
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4 space-y-2">
            <SideNavLink href="/calculator">
              Calculadora
            </SideNavLink>
          </nav>
        </SheetContent>
      </Sheet>

      <div className="flex items-center gap-4 ml-auto">
        <Link href="/login" className={buttonVariants({ variant: 'default' })}>
          Iniciar sesión
        </Link>

        <ThemeSwitcher className='hidden md:block' />
      </div>
    </header>
  )
}

const SideNavLink = ({ href, children, className, isSelected }: { href: string; children: React.ReactNode; className?: string; isSelected?: boolean }) => {
  return (
    <Link href={href} className={cn('flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary border border-transparent',
      isSelected ? 'text-primary bg-muted' : 'text-muted-foreground', className)}
    >
      {children}
    </Link>
  )
}
