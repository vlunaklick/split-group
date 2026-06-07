'use client'

import { useTheme } from '@/components/theme-provider'
import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'

export function ThemeSwitcher ({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isDark = resolvedTheme === 'dark'

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  return (
    <Button
      type="button"
      onClick={toggleTheme}
      variant="ghost"
      size="icon"
      className={cn('size-8 shrink-0 text-muted-foreground focus-visible:ring-1 focus-visible:ring-offset-0', className)}
      aria-label={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
    >
      {!mounted
        ? <span className="size-4" aria-hidden="true" />
        : isDark
          ? <Moon className="size-4" />
          : <Sun className="size-4" />}
    </Button>
  )
}
