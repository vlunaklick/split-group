'use client'

import { Icon } from '@/components/group-icons'
import { CreateGroupSheet } from '@/components/groups/sheets/create-group-sheet'
import { CreateSpendingSheet } from '@/components/spendings/sheets/create-spending-sheet'
import { Button } from '@/components/ui/button'
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
import { useCommandPaletteContext, useGlobalSearch } from '@/data/search'
import { useDebounce } from '@/hooks/use-debounce'
import { useModKeyLabel } from '@/hooks/use-mod-key-label'
import {
  getCommandHistory,
  getInputHistory,
  getRecentItems,
  type CommandHistoryEntry,
  type RecentItem,
  pushCommandHistory,
  pushInputHistory,
  rememberGroupVisit,
  rememberPageVisit,
  rememberSpendingVisit,
  shouldIgnorePaletteShortcut,
  trackPathnameVisit
} from '@/lib/command-palette-recents'
import {
  hasSeenCommandPaletteOnboarding,
  markCommandPaletteOnboardingSeen
} from '@/lib/command-palette-onboarding'
import { formatMoney } from '@/lib/money'
import { cn } from '@/lib/utils'
import {
  IconBell,
  IconCirclePlus,
  IconLayoutDashboard,
  IconPalette,
  IconReceipt,
  IconSearch,
  IconSettings,
  IconUser,
  IconUsers
} from '@tabler/icons-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'

type Group = {
  id: string
  name: string
  icon?: string | null
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

function PrefetchItem ({
  href,
  children,
  onSelect,
  ...props
}: React.ComponentProps<typeof CommandItem> & { href?: string }) {
  const router = useRouter()

  return (
    <CommandItem
      {...props}
      onMouseEnter={() => {
        if (href) router.prefetch(href)
      }}
      onSelect={onSelect}
    >
      {children}
    </CommandItem>
  )
}

function CommandPaletteInner () {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { data: groups = [] } = useGetUserGroups()
  const modKeyLabel = useModKeyLabel()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [createGroupOpen, setCreateGroupOpen] = useState(false)
  const [createSpendingGroupId, setCreateSpendingGroupId] = useState<string | null>(null)
  const [recentItems, setRecentItems] = useState<RecentItem[]>([])
  const [commandHistory, setCommandHistory] = useState<CommandHistoryEntry[]>([])
  const [inputHistoryIndex, setInputHistoryIndex] = useState(-1)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const inputHistoryRef = useRef<string[]>([])

  const debouncedSearch = useDebounce(search, 250)
  const activeGroupId = pathname.match(/^\/groups\/([^/]+)/)?.[1]
  const activeGroup = groups.find((group: Group) => group.id === activeGroupId)
  const isSearching = debouncedSearch.trim().length >= 2

  const { data: context } = useCommandPaletteContext(open)
  const { data: searchResults, isLoading: isSearchingRemote } = useGlobalSearch(debouncedSearch, open)

  useEffect(() => {
    if (hasSeenCommandPaletteOnboarding()) return

    const timer = window.setTimeout(() => setShowOnboarding(true), 900)
    return () => window.clearTimeout(timer)
  }, [])

  const dismissOnboarding = useCallback(() => {
    markCommandPaletteOnboardingSeen()
    setShowOnboarding(false)
  }, [])

  const openPalette = useCallback(() => {
    dismissOnboarding()
    setOpen(true)
  }, [dismissOnboarding])

  useEffect(() => {
    if (open && showOnboarding) {
      dismissOnboarding()
    }
  }, [dismissOnboarding, open, showOnboarding])

  useEffect(() => {
    trackPathnameVisit(pathname)
  }, [pathname])

  useEffect(() => {
    if (searchParams.get('cmd') === 'open') {
      setOpen(true)
      const params = new URLSearchParams(searchParams.toString())
      params.delete('cmd')
      const next = params.toString()
      router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false })
    }
  }, [pathname, router, searchParams])

  useEffect(() => {
    if (!open) return

    setRecentItems(getRecentItems())
    setCommandHistory(getCommandHistory())
    inputHistoryRef.current = getInputHistory()
    setInputHistoryIndex(-1)
    setSearch('')
  }, [open])

  const runCommand = useCallback((command: () => void) => {
    setOpen(false)
    command()
  }, [])

  const recordCommand = useCallback((entry: CommandHistoryEntry, inputValue?: string) => {
    pushCommandHistory(entry)
    if (inputValue?.trim()) pushInputHistory(inputValue)
    setCommandHistory(getCommandHistory())
  }, [])

  const navigate = useCallback((
    href: string,
    label: string,
    options?: {
      groupId?: string
      spendingId?: string
      icon?: string | null
      inputValue?: string
    }
  ) => {
    runCommand(() => {
      if (options?.spendingId && options.groupId) {
        rememberSpendingVisit({
          groupId: options.groupId,
          spendingId: options.spendingId,
          label,
          icon: options.icon
        })
      } else if (options?.groupId) {
        rememberGroupVisit(options.groupId, label, options.icon)
      } else {
        rememberPageVisit(href, label)
      }

      recordCommand({ label, href }, options?.inputValue ?? search)
      router.push(href)
    })
  }, [recordCommand, router, runCommand, search])

  const openCreateGroup = useCallback(() => {
    runCommand(() => {
      recordCommand({ label: 'Crear grupo', action: 'create-group' })
      setCreateGroupOpen(true)
    })
  }, [recordCommand, runCommand])

  const openCreateSpending = useCallback((groupId: string, groupName?: string) => {
    runCommand(() => {
      recordCommand({
        label: groupName ? `Crear gasto · ${groupName}` : 'Crear gasto',
        action: 'create-spending',
        groupId
      })
      setCreateSpendingGroupId(groupId)
    })
  }, [recordCommand, runCommand])

  const replayHistoryEntry = useCallback((entry: CommandHistoryEntry) => {
    if (entry.action === 'create-group') {
      openCreateGroup()
      return
    }

    if (entry.action === 'create-spending' && entry.groupId) {
      openCreateSpending(entry.groupId, entry.label.replace('Crear gasto · ', ''))
      return
    }

    if (entry.href) {
      navigate(entry.href, entry.label)
    }
  }, [navigate, openCreateGroup, openCreateSpending])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        if (shouldIgnorePaletteShortcut(event.target)) return

        event.preventDefault()
        setOpen((current) => !current)
        return
      }

      if (!open || search.trim().length > 0) return

      if (event.key === 'g' && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault()
        openCreateGroup()
        return
      }

      if (event.key === 'n' && activeGroupId && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault()
        openCreateSpending(activeGroupId)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeGroupId, open, openCreateGroup, openCreateSpending, search])

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!event.altKey) return
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return
    if (search.trim().length > 0) return

    const history = inputHistoryRef.current
    if (history.length === 0) return

    event.preventDefault()

    if (event.key === 'ArrowUp') {
      const nextIndex = inputHistoryIndex >= history.length - 1 ? history.length - 1 : inputHistoryIndex + 1
      setInputHistoryIndex(nextIndex)
      setSearch(history[nextIndex] ?? '')
      return
    }

    const nextIndex = inputHistoryIndex <= 0 ? -1 : inputHistoryIndex - 1
    setInputHistoryIndex(nextIndex)
    setSearch(nextIndex === -1 ? '' : history[nextIndex] ?? '')
  }

  const enrichedRecents = useMemo(() => {
    return recentItems.map((item) => {
      if (item.type === 'group' && item.groupId) {
        const group = groups.find((entry: Group) => entry.id === item.groupId)
        if (group) return { ...item, label: group.name, icon: group.icon }
      }

      return item
    })
  }, [groups, recentItems])

  const hasSearchResults = isSearching && searchResults && (
    searchResults.spendings.length > 0 ||
    searchResults.participants.length > 0 ||
    searchResults.groups.length > 0 ||
    searchResults.debts.length > 0 ||
    searchResults.notifications.length > 0
  )

  return (
    <>
      <div className="relative md:min-w-[220px] md:flex-1 md:max-w-sm">
        <button
          type="button"
          onClick={openPalette}
          className={cn(
            'inline-flex h-9 w-full items-center gap-2 rounded-md border border-border/80 bg-muted/30 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground',
            'max-md:size-9 max-md:justify-center max-md:px-0',
            showOnboarding && 'ring-2 ring-primary/30 ring-offset-2 ring-offset-background'
          )}
          aria-label="Buscar"
        >
          <IconSearch className="size-4 shrink-0" />
          <span className="hidden md:inline-flex flex-1 text-left">Buscar…</span>
          <CommandShortcut className="hidden md:inline" suppressHydrationWarning>
            {modKeyLabel}K
          </CommandShortcut>
        </button>

        {showOnboarding && (
          <div
            role="dialog"
            aria-labelledby="command-palette-onboarding-title"
            className="absolute left-0 top-[calc(100%+0.5rem)] z-50 w-[min(20rem,calc(100vw-2rem))] rounded-lg border border-border/80 bg-popover p-4 shadow-sm animate-in fade-in-0 slide-in-from-top-2"
          >
            <div className="absolute -top-1.5 left-6 size-3 rotate-45 border-l border-t border-border/80 bg-popover" />
            <p id="command-palette-onboarding-title" className="text-sm font-medium">
              Movéte más rápido
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              Usá{' '}
              <kbd className="rounded border border-border/80 bg-muted px-1.5 py-0.5 font-mono text-[11px] text-foreground">
                {modKeyLabel}K
              </kbd>{' '}
              para ir a grupos, crear gastos o encontrar cualquier cosa.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" onClick={openPalette}>
                Probar ahora
              </Button>
              <Button size="sm" variant="ghost" onClick={dismissOnboarding}>
                Entendido
              </Button>
            </div>
          </div>
        )}
      </div>

      <CommandDialog open={open} onOpenChange={setOpen} shouldFilter={!isSearching}>
        <CommandInput
          data-command-palette-input
          placeholder="Buscar grupos, gastos, personas o acciones…"
          value={search}
          onValueChange={setSearch}
          onKeyDown={handleInputKeyDown}
        />
        <CommandList>
          <CommandEmpty>
            {isSearchingRemote ? 'Buscando…' : 'No se encontró nada.'}
          </CommandEmpty>

          {activeGroupId && !isSearching && (
            <CommandGroup heading={activeGroup?.name ?? 'Grupo actual'}>
              {groupTabs(activeGroupId).map((tab) => (
                <PrefetchItem
                  key={tab.href}
                  href={tab.href}
                  value={`${activeGroup?.name ?? 'grupo'} ${tab.label}`}
                  onSelect={() => navigate(tab.href, `${activeGroup?.name ?? 'Grupo'} · ${tab.label}`, {
                    groupId: activeGroupId,
                    icon: activeGroup?.icon
                  })}
                >
                  <tab.icon className="size-4" />
                  {tab.label}
                </PrefetchItem>
              ))}
              <PrefetchItem
                value={`${activeGroup?.name ?? 'grupo'} crear gasto`}
                keywords={['nuevo', 'gasto']}
                onSelect={() => openCreateSpending(activeGroupId, activeGroup?.name)}
              >
                <IconReceipt className="size-4" />
                Crear gasto
                <CommandShortcut>N</CommandShortcut>
              </PrefetchItem>
            </CommandGroup>
          )}

          {!isSearching && (context?.pendingInvites.length || context?.unreadNotifications.length) ? (
            <>
              <CommandSeparator />
              <CommandGroup heading="Notificaciones">
                {context?.pendingInvites.map((notification) => (
                  <PrefetchItem
                    key={notification.id}
                    href="/notifications"
                    value={`invitacion ${notification.groupName ?? notification.message}`}
                    keywords={['unirse', 'invitar', 'grupo']}
                    onSelect={() => navigate('/notifications', `Invitación · ${notification.groupName ?? 'grupo'}`)}
                  >
                    <IconBell className="size-4" />
                    <span className="truncate">
                      Invitación a {notification.groupName ?? 'un grupo'}
                    </span>
                  </PrefetchItem>
                ))}
                {context?.unreadNotifications.map((notification) => (
                  <PrefetchItem
                    key={notification.id}
                    href="/notifications"
                    value={`aviso ${notification.title ?? notification.message}`}
                    onSelect={() => navigate('/notifications', notification.title ?? 'Notificación')}
                  >
                    <IconBell className="size-4" />
                    <span className="truncate">{notification.title ?? notification.message}</span>
                  </PrefetchItem>
                ))}
              </CommandGroup>
            </>
          ) : null}

          {!isSearching && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Acciones">
                <PrefetchItem
                  value="crear grupo nuevo"
                  keywords={['crear', 'grupo', 'add', 'new']}
                  onSelect={openCreateGroup}
                >
                  <IconCirclePlus className="size-4" />
                  Crear grupo
                  <CommandShortcut>G</CommandShortcut>
                </PrefetchItem>
              </CommandGroup>
            </>
          )}

          {isSearching && hasSearchResults && (
            <>
              {searchResults!.spendings.length > 0 && (
                <CommandGroup heading="Gastos">
                  {searchResults!.spendings.map((spending) => (
                    <PrefetchItem
                      key={spending.id}
                      href={`/groups/${spending.groupId}/spendings/${spending.id}`}
                      value={`gasto ${spending.name} ${spending.groupName}`}
                      onSelect={() => navigate(
                        `/groups/${spending.groupId}/spendings/${spending.id}`,
                        `${spending.name} · ${spending.groupName}`,
                        {
                          groupId: spending.groupId,
                          spendingId: spending.id,
                          icon: spending.groupIcon,
                          inputValue: search
                        }
                      )}
                    >
                      <IconReceipt className="size-4" />
                      <span className="min-w-0 truncate">{spending.name}</span>
                      <span className="ml-auto flex shrink-0 items-center gap-2 text-xs">
                        <span className="font-mono text-foreground">{formatMoney(spending.value)}</span>
                        <span className="max-w-[5.5rem] truncate text-muted-foreground">
                          {spending.groupName}
                        </span>
                      </span>
                    </PrefetchItem>
                  ))}
                </CommandGroup>
              )}

              {searchResults!.participants.length > 0 && (
                <CommandGroup heading="Personas">
                  {searchResults!.participants.map((participant) => (
                    <PrefetchItem
                      key={`${participant.id}-${participant.groupId}`}
                      href={`/groups/${participant.groupId}/participants`}
                      value={`persona ${participant.name ?? participant.username} ${participant.groupName}`}
                      onSelect={() => navigate(
                        `/groups/${participant.groupId}/participants`,
                        `${participant.name ?? participant.username ?? 'Participante'} · ${participant.groupName}`,
                        { groupId: participant.groupId, icon: participant.groupIcon, inputValue: search }
                      )}
                    >
                      <IconUser className="size-4" />
                      <span className="truncate">{participant.name ?? participant.username}</span>
                      <span className="ml-auto truncate text-xs text-muted-foreground">
                        {participant.groupName}
                      </span>
                    </PrefetchItem>
                  ))}
                </CommandGroup>
              )}

              {searchResults!.debts.length > 0 && (
                <CommandGroup heading="Saldos">
                  {searchResults!.debts.map((debt, index) => (
                    <PrefetchItem
                      key={`${debt.userId}-${debt.groupId}-${index}`}
                      href={`/groups/${debt.groupId}`}
                      value={`deuda ${debt.userName} ${debt.groupName}`}
                      onSelect={() => navigate(
                        `/groups/${debt.groupId}`,
                        `Saldo con ${debt.userName ?? 'usuario'} · ${debt.groupName}`,
                        { groupId: debt.groupId, icon: debt.groupIcon, inputValue: search }
                      )}
                    >
                      <IconReceipt className="size-4" />
                      <span className="truncate">
                        {debt.isDebter ? 'Debes' : 'Te deben'} {formatMoney(Math.abs(debt.amount))}
                      </span>
                      <span className="ml-auto truncate text-xs text-muted-foreground">
                        {debt.userName} · {debt.groupName}
                      </span>
                    </PrefetchItem>
                  ))}
                </CommandGroup>
              )}

              {searchResults!.groups.length > 0 && (
                <CommandGroup heading="Grupos">
                  {searchResults!.groups.map((group) => (
                    <PrefetchItem
                      key={group.id}
                      href={`/groups/${group.id}`}
                      value={`grupo ${group.name}`}
                      onSelect={() => navigate(`/groups/${group.id}`, group.name, {
                        groupId: group.id,
                        icon: group.icon,
                        inputValue: search
                      })}
                    >
                      <Icon type={group.icon ?? 'award'} className="size-4" />
                      {group.name}
                    </PrefetchItem>
                  ))}
                </CommandGroup>
              )}

              {searchResults!.notifications.length > 0 && (
                <CommandGroup heading="Avisos">
                  {searchResults!.notifications.map((notification) => (
                    <PrefetchItem
                      key={notification.id}
                      href="/notifications"
                      value={`aviso ${notification.title ?? notification.message}`}
                      onSelect={() => navigate('/notifications', notification.title ?? notification.message, {
                        inputValue: search
                      })}
                    >
                      <IconBell className="size-4" />
                      <span className="truncate">{notification.title ?? notification.message}</span>
                    </PrefetchItem>
                  ))}
                </CommandGroup>
              )}
            </>
          )}

          {!isSearching && enrichedRecents.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Recientes">
                {enrichedRecents.map((item) => (
                  <PrefetchItem
                    key={item.id}
                    href={item.href}
                    value={`reciente ${item.label} ${item.type}`}
                    onSelect={() => navigate(item.href, item.label, {
                      groupId: item.groupId,
                      spendingId: item.spendingId,
                      icon: item.icon
                    })}
                  >
                    {item.type === 'spending'
                      ? <IconReceipt className="size-4" />
                      : item.type === 'page'
                        ? <IconLayoutDashboard className="size-4" />
                        : <Icon type={item.icon ?? 'award'} className="size-4" />}
                    <span className="truncate">{item.label}</span>
                  </PrefetchItem>
                ))}
              </CommandGroup>
            </>
          )}

          {!isSearching && commandHistory.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Historial">
                {commandHistory.slice(0, 5).map((entry) => (
                  <CommandItem
                    key={entry.label}
                    value={`historial ${entry.label}`}
                    onSelect={() => replayHistoryEntry(entry)}
                  >
                    <IconSearch className="size-4" />
                    <span className="truncate">{entry.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}

          {!isSearching && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Navegación">
                {navigationItems.map((item) => (
                  <PrefetchItem
                    key={item.href}
                    href={item.href}
                    value={`${item.label} ${item.keywords}`}
                    onSelect={() => navigate(item.href, item.label)}
                  >
                    <item.icon className="size-4" />
                    {item.label}
                  </PrefetchItem>
                ))}
              </CommandGroup>
            </>
          )}

          {!isSearching && groups.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Grupos">
                {groups.map((group: Group) => (
                  <PrefetchItem
                    key={group.id}
                    href={`/groups/${group.id}`}
                    value={`${group.name} ir resumen gastos participantes nuevo gasto`}
                    keywords={['grupo', 'gastos', 'participantes', 'nuevo']}
                    onSelect={() => navigate(`/groups/${group.id}`, group.name, {
                      groupId: group.id,
                      icon: group.icon
                    })}
                  >
                    <Icon type={group.icon ?? 'award'} className="size-4" />
                    <span className="truncate">{group.name}</span>
                    <CommandShortcut className="hidden lg:inline">↵</CommandShortcut>
                  </PrefetchItem>
                ))}
                {groups.map((group: Group) => (
                  <PrefetchItem
                    key={`${group.id}-spendings`}
                    href={`/groups/${group.id}/spendings`}
                    value={`${group.name} gastos lista`}
                    className="pl-8"
                    onSelect={() => navigate(`/groups/${group.id}/spendings`, `${group.name} · Gastos`, {
                      groupId: group.id,
                      icon: group.icon
                    })}
                  >
                    <IconReceipt className="size-4" />
                    Gastos · {group.name}
                  </PrefetchItem>
                ))}
                {groups.map((group: Group) => (
                  <PrefetchItem
                    key={`${group.id}-create`}
                    value={`${group.name} nuevo gasto crear`}
                    keywords={['crear', 'gasto']}
                    className="pl-8"
                    onSelect={() => openCreateSpending(group.id, group.name)}
                  >
                    <IconCirclePlus className="size-4" />
                    Nuevo gasto · {group.name}
                  </PrefetchItem>
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

export function CommandPalette () {
  return (
    <Suspense fallback={(
      <div className="inline-flex h-9 min-w-[220px] max-w-sm flex-1 items-center gap-2 rounded-md border border-border/80 bg-muted/30 px-3 max-md:size-9 max-md:min-w-0 max-md:flex-none max-md:justify-center max-md:px-0">
        <IconSearch className="size-4 shrink-0 text-muted-foreground" />
        <span className="hidden flex-1 text-left text-sm text-muted-foreground md:inline-flex">Buscar…</span>
      </div>
    )}
    >
      <CommandPaletteInner />
    </Suspense>
  )
}
