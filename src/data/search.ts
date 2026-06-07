import useSWR from 'swr'
import type { CommandPaletteContext, GlobalSearchResults } from '@/data/apis/search'

export function useCommandPaletteContext (enabled: boolean) {
  return useSWR<CommandPaletteContext>(
    enabled ? ['command-palette-context'] : null,
    async () => fetch('/api/search?context=true').then((res) => res.json())
  )
}

export function useGlobalSearch (query: string, enabled: boolean) {
  const trimmed = query.trim()

  return useSWR<GlobalSearchResults>(
    enabled && trimmed.length >= 2 ? ['global-search', trimmed] : null,
    async ([_, q]) => fetch(`/api/search?q=${encodeURIComponent(q as string)}`).then((res) => res.json())
  )
}
