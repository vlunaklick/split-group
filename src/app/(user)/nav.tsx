'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export const SettingsNav = () => {
  const pathname = usePathname()

  return (
    <nav
      className="grid gap-4 text-sm text-muted-foreground" x-chunk="dashboard-04-chunk-0"
    >
      <Link href="/settings" className={cn(pathname === '/settings' && 'font-semibold text-primary')}>
        General
      </Link>
      <Link href="/settings/notifications" className={cn(pathname === '/settings/notifications' && 'font-semibold text-primary')}>
        Notificaciones
      </Link>
      <Link href="/settings/appearance" className={cn(pathname === '/settings/appearance' && 'font-semibold text-primary')}>
        Apariencia
      </Link>
    </nav>
  )
}
