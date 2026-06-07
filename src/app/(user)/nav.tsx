'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/settings', label: 'General' },
  { href: '/notifications', label: 'Bandeja' },
  { href: '/settings/notifications', label: 'Preferencias' },
  { href: '/settings/appearance', label: 'Apariencia' }
]

export const SettingsNav = () => {
  const pathname = usePathname()

  return (
    <nav className="flex gap-4 overflow-x-auto text-sm text-muted-foreground md:grid md:gap-4 md:overflow-visible">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            'shrink-0 pb-2 md:pb-0 border-b-2 border-transparent',
            pathname === link.href && 'font-semibold text-primary border-primary'
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}
