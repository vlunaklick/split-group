'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from './ui/button'
import { useEffect, useState } from 'react'

export function ThemeSwitcher ({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  return (
    <Button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} variant="ghost" className="px-3">
      {mounted && theme === 'dark'
        ? (<Moon className="size-4" />)
        : (<Sun className="size-4" />)
      }
    </Button>
  )
}
