'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = (groupId: string) => [
  { href: `/groups/${groupId}`, label: 'Resumen', exact: true },
  { href: `/groups/${groupId}/spendings`, label: 'Gastos', exact: false },
  { href: `/groups/${groupId}/participants`, label: 'Participantes', exact: false }
]

export function GroupNav ({ groupId }: { groupId: string }) {
  const pathname = usePathname()

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-border pb-px">
      {tabs(groupId).map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={cn(
            'shrink-0 px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground',
            isActive(tab.href, tab.exact) && 'border-b-2 border-primary text-foreground'
          )}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  )
}
