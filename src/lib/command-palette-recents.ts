const RECENTS_KEY = 'split-group-command-recents'
const LEGACY_GROUPS_KEY = 'split-group-recent-groups'
const INPUT_HISTORY_KEY = 'split-group-command-input-history'
const COMMAND_HISTORY_KEY = 'split-group-command-history'

export type RecentItem = {
  id: string
  type: 'group' | 'page' | 'spending'
  href: string
  label: string
  groupId?: string
  spendingId?: string
  icon?: string | null
}

export type CommandHistoryEntry = {
  label: string
  href?: string
  action?: 'create-group' | 'create-spending'
  groupId?: string
}

const PAGE_LABELS: Record<string, string> = {
  '/dashboard': 'Inicio',
  '/notifications': 'Notificaciones',
  '/settings': 'Configuración',
  '/settings/appearance': 'Apariencia',
  '/settings/notifications': 'Alertas'
}

function readJson<T> (key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback

  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) as T : fallback
  } catch {
    return fallback
  }
}

function writeJson (key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value))
}

function migrateLegacyGroups () {
  const legacy = readJson<string[]>(LEGACY_GROUPS_KEY, [])

  if (legacy.length === 0) return

  const recents = readJson<RecentItem[]>(RECENTS_KEY, [])

  for (const groupId of legacy) {
    if (recents.some((item) => item.id === `group-${groupId}`)) continue

    recents.unshift({
      id: `group-${groupId}`,
      type: 'group',
      href: `/groups/${groupId}`,
      label: 'Grupo',
      groupId
    })
  }

  writeJson(RECENTS_KEY, recents.slice(0, 8))
  localStorage.removeItem(LEGACY_GROUPS_KEY)
}

export function getRecentItems (): RecentItem[] {
  migrateLegacyGroups()
  return readJson<RecentItem[]>(RECENTS_KEY, [])
}

export function rememberRecentItem (item: Omit<RecentItem, 'id'> & { id?: string }) {
  const id = item.id ?? `${item.type}-${item.href}`
  const recents = getRecentItems().filter((entry) => entry.id !== id)

  recents.unshift({ ...item, id })
  writeJson(RECENTS_KEY, recents.slice(0, 8))
}

export function rememberGroupVisit (groupId: string, label: string, icon?: string | null) {
  rememberRecentItem({
    type: 'group',
    href: `/groups/${groupId}`,
    label,
    groupId,
    icon
  })
}

export function rememberSpendingVisit ({
  groupId,
  spendingId,
  label,
  icon
}: {
  groupId: string
  spendingId: string
  label: string
  icon?: string | null
}) {
  rememberRecentItem({
    type: 'spending',
    href: `/groups/${groupId}/spendings/${spendingId}`,
    label,
    groupId,
    spendingId,
    icon
  })
}

export function rememberPageVisit (href: string, label?: string) {
  rememberRecentItem({
    type: 'page',
    href,
    label: label ?? PAGE_LABELS[href] ?? 'Página'
  })
}

export function trackPathnameVisit (pathname: string) {
  if (pathname === '/dashboard') {
    rememberPageVisit('/dashboard')
    return
  }

  if (PAGE_LABELS[pathname]) {
    rememberPageVisit(pathname)
    return
  }

  const spendingMatch = pathname.match(/^\/groups\/([^/]+)\/spendings\/([^/]+)$/)

  if (spendingMatch) {
    rememberRecentItem({
      type: 'spending',
      href: pathname,
      label: 'Gasto',
      groupId: spendingMatch[1],
      spendingId: spendingMatch[2]
    })
    return
  }

  const groupMatch = pathname.match(/^\/groups\/([^/]+)/)

  if (groupMatch) {
    rememberRecentItem({
      type: 'group',
      href: `/groups/${groupMatch[1]}`,
      label: 'Grupo',
      groupId: groupMatch[1]
    })
  }
}

export function getInputHistory (): string[] {
  return readJson<string[]>(INPUT_HISTORY_KEY, [])
}

export function pushInputHistory (value: string) {
  const trimmed = value.trim()
  if (!trimmed) return

  const history = getInputHistory().filter((entry) => entry !== trimmed)
  history.unshift(trimmed)
  writeJson(INPUT_HISTORY_KEY, history.slice(0, 20))
}

export function getCommandHistory (): CommandHistoryEntry[] {
  return readJson<CommandHistoryEntry[]>(COMMAND_HISTORY_KEY, [])
}

export function pushCommandHistory (entry: CommandHistoryEntry) {
  const history = getCommandHistory().filter((item) => item.label !== entry.label)
  history.unshift(entry)
  writeJson(COMMAND_HISTORY_KEY, history.slice(0, 15))
}

export function shouldIgnorePaletteShortcut (target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false

  if (target.isContentEditable) return true

  const tag = target.tagName

  if (tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') {
    return false
  }

  if (target.closest('[cmdk-input-wrapper]')) return false
  if (target.closest('[data-command-palette-input]')) return false

  return true
}
