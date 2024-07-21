'use client'

import Link from 'next/link'
import { Home } from 'lucide-react'
import { Separator } from './ui/separator'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { IconCirclePlus } from '@tabler/icons-react'
import useSWR from 'swr'
import { getUserGroups } from '@/lib/data'
import { Icon } from './group-icons'
import { Skeleton } from './ui/skeleton'

export const SideNav = ({ userId }: { userId: string }) => {
  const { data: groups = [], isLoading } = useSWR('user-groups', async () => await getUserGroups(userId))
  const path = usePathname()

  const selectedPath = (href: string) => {
    return path === href
  }

  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4 space-y-2">
      <p className="text-zinc-400 text-xs font-medium tracking-wide">General</p>
      <SideNavLink href="/dashboard" isSelected={selectedPath('/dashboard')}>
        <Home className="h-4 w-4" />
        Dashboard
      </SideNavLink>

      <Separator />
      <p className="text-zinc-400 text-xs font-medium tracking-wide">Grupos</p>
      <SideNavLink href="/groups/create" isSelected={selectedPath('/groups/create')} className='dark:border-zinc-800 border-zinc-200'>
        <IconCirclePlus className="h-4 w-4" />
        Crear grupo
      </SideNavLink>

      {isLoading && <SideNavLinksSkeleton />}

      {groups?.map((group: any) => (
        <SideNavLink key={group.id} href={`/groups/${group.id}`} isSelected={selectedPath(`/groups/${group.id}`)}>
          <Icon type={group.icon} className="h-4 w-4" />
          {group.name}
        </SideNavLink>
      ))}
    </nav>
  )
}

const SideNavLink = ({ href, children, className, isSelected }: { href: string; children: React.ReactNode; className?: string; isSelected?: boolean }) => {
  return (
    <Link href={href} className={cn('flex items-center gap-3 rounded-lg px-3 py-2 transition-all dark:hover:text-white hover:text-black border border-transparent',
      isSelected ? 'text-black dark:text-white bg-zinc-50 dark:bg-zinc-950' : 'text-zinc-500 dark:text-zinc-400', className)}
    >
      {children}
    </Link>
  )
}

const SideNavLinksSkeleton = () => {
  return (
    <>
      <Skeleton className="h-[38px] w-full" />
      <Skeleton className="h-[38px] w-full" />
      <Skeleton className="h-[38px] w-full" />
    </>
  )
}
