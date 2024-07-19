'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export const SettingsNav = () => {
  const pathname = usePathname()

  return (
    <nav
      className="grid gap-4 text-sm text-zinc-400" x-chunk="dashboard-04-chunk-0"
    >
      <Link href="/settings" className={cn(pathname === '/settings' && 'font-semibold text-black dark:text-white')}>
        General
      </Link>
      <Link href="/settings/notifications" className={cn(pathname === '/settings/notifications' && 'font-semibold text-black dark:text-white')}>
        Notificaciones
      </Link>
      <Link href="/settings/appearance" className={cn(pathname === '/settings/appearance' && 'font-semibold text-black dark:text-white')}>
        Apariencia
      </Link>
    </nav>
  )
}
