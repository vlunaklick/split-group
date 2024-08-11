'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'
import { Logo } from '../logo'

export function MainNav () {
  const pathname = usePathname()

  return (
    <div className="mr-4 md:flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <Logo className="text-2xl" />
        <span className="hidden font-bold sm:inline-block">
          {siteConfig.name}
        </span>
      </Link>
      <nav className="hidden lg:flex lg:items-center lg:gap-6 text-sm">
        <Link
          href="/calculator"
          className={cn(
            'transition-colors hover:text-foreground/80',
            pathname === '/calculator' ? 'text-foreground' : 'text-foreground/60'
          )}
        >
          Calculadora
        </Link>
      </nav>
    </div>
  )
}
