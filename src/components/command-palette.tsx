'use client'

import { Icon } from '@/components/group-icons'
import { CreateGroupSheet } from '@/components/groups/sheets/create-group-sheet'
import { CreateSpendingSheet } from '@/components/spendings/sheets/create-spending-sheet'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut
} from '@/components/ui/command'
import { useGetUserGroups } from '@/data/groups'
import { useModKeyLabel } from '@/hooks/use-mod-key-label'
import { cn } from '@/lib/utils'
import {
  IconBell,
  IconCirclePlus,
  IconLayoutDashboard,
  IconPalette,
  IconReceipt,
  IconSearch,
  IconSettings,
  IconUsers
} from '@tabler/icons-react'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'

const RECENT_GROUPS_KEY = 'split-group-recent-groups'

type Group = {
  id: string
  name: string
  icon?: string | null
}

function getRecentGroupIds (): string[] {
  if (typeof window === 'undefined') return []

  try {
    const stored = localStorage.getItem(RECENT_GROUPS_KEY)
    return stored ? (JSON.parse(stored) as string[]) : []
  } catch {
    return []
  }
}

function rememberGroup (groupId: string) {
  const recent = getRecentGroupIds().filter((id) => id !== groupId)
  recent.unshift(groupId)
  localStorage.setItem(RECENT_GROUPS_KEY, JSON.stringify(recent.slice(0, 5)))
}

const navigationItems = [
  { href: '/dashboard', label: 'Inicio', icon: IconLayoutDashboard, keywords: 'dashboard panel inicio home' },
  { href: '/notifications', label: 'Notificaciones', icon: IconBell, keywords: 'avisos alertas' },
  { href: '/settings', label: 'Configuración', icon: IconSettings, keywords: 'cuenta perfil ajustes' },
  { href: '/settings/appearance', label: 'Apariencia', icon: IconPalette, keywords: 'tema dark light modo' }
] as const

const groupTabs = (groupId: string) => [
  { href: `/groups/${groupId}`, label: 'Resumen', icon: IconLayoutDashboard },
  { href: `/groups/${groupId}/spendings`, label: 'Gastos', icon: IconReceipt },
  { href: `/groups/${groupId}/participants`, label: 'Participantes', icon: IconUsers }
] as const

export function CommandPalette () {
  const router = useRouter()
  const pathname = usePathname()
  const { data: groups = [] } = useGetUserGroups()
  const modKeyLabel = useModKeyLabel()
  const [open, setOpen] = useState(false)
  const [createGroupOpen, setCreateGroupOpen] = useState(false)
  const [createSpendingGroupId, setCreateSpendingGroupId] = useState<string | null>(null)
  const [recentGroupIds, setRecentGroupIds] = useState<string[]>([])

  const activeGroupId = pathname.match(/^\/groups\/([^/]+)/)?.[1]

  useEffect(() => {
    setRecentGroupIds(getRecentGroupIds())
  }, [open])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen((current) => !current)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const recentGroups = useMemo(() => {
    return recentGroupIds
      .map((id) => groups.find((group: Group) => group.id === id))
      .filter(Boolean) as Group[]
  }, [groups, recentGroupIds])

  const runCommand = useCallback((command: () => void) => {
    setOpen(false)
    command()
  }, [])

  const navigate = useCallback((href: string, groupId?: string) => {
    runCommand(() => {
      if (groupId) rememberGroup(groupId)
      router.push(href)
    })
  }, [router, runCommand])

  const openCreateGroup = useCallback(() => {
    runCommand(() => setCreateGroupOpen(true))
  }, [runCommand])

  const openCreateSpending = useCallback((groupId: string) => {
    runCommand(() => setCreateSpendingGroupId(groupId))
  }, [runCommand])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          'inline-flex h-9 items-center gap-2 rounded-md border border-border/80 bg-muted/30 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground',
          'md:min-w-[220px] md:flex-1 md:max-w-sm',
          'max-md:size-9 max-md:justify-center max-md:px-0'
        )}
        aria-label="Buscar"
      >
        <IconSearch className="size-4 shrink-0" />
        <span className="hidden md:inline-flex flex-1 text-left">Buscar…</span>
        <CommandShortcut className="hidden md:inline" suppressHydrationWarning>
          {modKeyLabel}K
        </CommandShortcut>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Buscar grupos, páginas o acciones…" />
        <CommandList>
          <CommandEmpty>No se encontró nada.</CommandEmpty>

          <CommandGroup heading="Acciones">
            <CommandItem
              value="crear grupo nuevo"
              keywords={['crear', 'grupo', 'add', 'new']}
              onSelect={openCreateGroup}
            >
              <IconCirclePlus className="size-4" />
              Crear grupo
            </CommandItem>
            {activeGroupId && (
              <CommandItem
                value="crear gasto grupo actual"
                keywords={['crear', 'gasto', 'spending', 'nuevo']}
                onSelect={() => openCreateSpending(activeGroupId)}
              >
                <IconReceipt className="size-4" />
                Crear gasto
              </CommandItem>
            )}
          </CommandGroup>

          {recentGroups.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Recientes">
                {recentGroups.map((group) => (
                  <CommandItem
                    key={`recent-${group.id}`}
                    value={`reciente ${group.name}`}
                    onSelect={() => navigate(`/groups/${group.id}`, group.id)}
                  >
                    <Icon type={group.icon ?? 'award'} className="size-4" />
                    {group.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}

          <CommandSeparator />
          <CommandGroup heading="Navegación">
            {navigationItems.map((item) => (
              <CommandItem
                key={item.href}
                value={`${item.label} ${item.keywords}`}
                onSelect={() => navigate(item.href)}
              >
                <item.icon className="size-4" />
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>

          {groups.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Grupos">
                {groups.map((group: Group) => (
                  <CommandItem
                    key={group.id}
                    value={`grupo ${group.name}`}
                    onSelect={() => navigate(`/groups/${group.id}`, group.id)}
                  >
                    <Icon type={group.icon ?? 'award'} className="size-4" />
                    {group.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}

          {activeGroupId && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Grupo actual">
                {groupTabs(activeGroupId).map((tab) => (
                  <CommandItem
                    key={tab.href}
                    value={`${tab.label} grupo actual`}
                    onSelect={() => navigate(tab.href, activeGroupId)}
                  >
                    <tab.icon className="size-4" />
                    {tab.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}

          {groups.length > 0 && !activeGroupId && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Nuevo gasto">
                {groups.map((group: Group) => (
                  <CommandItem
                    key={`spending-${group.id}`}
                    value={`crear gasto ${group.name}`}
                    keywords={['nuevo', 'gasto', 'spending']}
                    onSelect={() => openCreateSpending(group.id)}
                  >
                    <IconReceipt className="size-4" />
                    {group.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>

      <CreateGroupSheet
        open={createGroupOpen}
        onOpenChange={setCreateGroupOpen}
        hideTrigger
      />

      {createSpendingGroupId && (
        <CreateSpendingSheet
          groupId={createSpendingGroupId}
          open
          onOpenChange={(nextOpen) => {
            if (!nextOpen) setCreateSpendingGroupId(null)
          }}
          hideTrigger
        />
      )}
    </>
  )
}
