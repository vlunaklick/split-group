'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from './ui/button'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export function ThemeSwitcher ({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  return (
    <Button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} variant="ghost" className={cn('px-3', className)}>
      {mounted && theme === 'dark'
        ? (<Moon className="size-4" />)
        : (<Sun className="size-4" />)
      }
    </Button>
  )
}
