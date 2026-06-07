export const THEME_STORAGE_KEY = 'split-group-theme'

export type Theme = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

export function getSystemTheme (): ResolvedTheme {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function getStoredTheme (): Theme {
  if (typeof window === 'undefined') return 'system'

  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  if (stored === 'light' || stored === 'dark' || stored === 'system') return stored

  // Migración desde next-themes
  const legacy = localStorage.getItem('theme')
  if (legacy === 'light' || legacy === 'dark' || legacy === 'system') return legacy

  return 'system'
}

export function resolveTheme (theme: Theme): ResolvedTheme {
  if (theme === 'light' || theme === 'dark') return theme
  return getSystemTheme()
}

export function applyThemeToDocument (resolved: ResolvedTheme) {
  const root = document.documentElement
  root.classList.remove('light', 'dark')
  root.classList.add(resolved)
  root.style.colorScheme = resolved
}

export function persistTheme (theme: Theme) {
  localStorage.setItem(THEME_STORAGE_KEY, theme)
}

export const themeInitScript = `(function(){try{var k='${THEME_STORAGE_KEY}';var t=localStorage.getItem(k)||localStorage.getItem('theme');var s=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';var r=t==='light'||t==='dark'?t:s;var d=document.documentElement;d.classList.remove('light','dark');d.classList.add(r);d.style.colorScheme=r;}catch(e){}})();`
