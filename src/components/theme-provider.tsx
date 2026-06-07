'use client'

import {
  applyThemeToDocument,
  getStoredTheme,
  getSystemTheme,
  persistTheme,
  resolveTheme,
  type ResolvedTheme,
  type Theme
} from '@/lib/theme'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'

type ThemeContextValue = {
  theme: Theme
  resolvedTheme: ResolvedTheme
  systemTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function useTheme () {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

export function ThemeProvider ({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system')
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light')
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>('light')

  useEffect(() => {
    const stored = getStoredTheme()
    const system = getSystemTheme()
    const resolved = resolveTheme(stored)

    setThemeState(stored)
    setSystemTheme(system)
    setResolvedTheme(resolved)
    applyThemeToDocument(resolved)
  }, [])

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = () => {
      const system = getSystemTheme()
      setSystemTheme(system)

      if (theme === 'system') {
        setResolvedTheme(system)
        applyThemeToDocument(system)
      }
    }

    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [theme])

  const setTheme = useCallback((next: Theme) => {
    const resolved = resolveTheme(next)
    setThemeState(next)
    setResolvedTheme(resolved)
    persistTheme(next)
    applyThemeToDocument(resolved)
  }, [])

  const value = useMemo(
    () => ({ theme, resolvedTheme, systemTheme, setTheme }),
    [theme, resolvedTheme, systemTheme, setTheme]
  )

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
