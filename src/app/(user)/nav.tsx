'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/settings', label: 'Panel', exact: true },
  { href: '/settings/account', label: 'Cuenta' },
  { href: '/notifications', label: 'Avisos' },
  { href: '/settings/notifications', label: 'Alertas' },
  { href: '/settings/appearance', label: 'Apariencia' }
]

function isActive (pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href
  return pathname === href || pathname.startsWith(`${href}/`)
}

export const SettingsNav = () => {
  const pathname = usePathname()

  return (
    <nav className="flex gap-5 overflow-x-auto text-sm md:flex-col md:gap-3">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            'shrink-0 text-muted-foreground transition-colors hover:text-foreground',
            isActive(pathname, link.href, link.exact) && 'border-b border-foreground pb-1 text-foreground md:border-b-0 md:font-medium'
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}
