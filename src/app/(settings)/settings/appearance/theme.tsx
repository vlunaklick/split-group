'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

export const ThemeSetting = () => {
  const { setTheme, resolvedTheme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState('system')

  useEffect(() => {
    setMounted(true)
    setSelectedTheme(resolvedTheme || 'system')
  }, [])

  const changeTheme = () => {
    setTheme(selectedTheme)
    toast.success('Tema guardado correctamente', {
      duration: 1000
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Selecciona el tema</CardTitle>
        <CardDescription>
          Personaliza la apariencia de la aplicación seleccionando un tema.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" onSubmit={e => e.preventDefault()}>
          {!mounted && (
              <ThemeSelectorSkeleton />
          )}

          {mounted && (
            <ThemeSelector selectedTheme={selectedTheme} setSelectedTheme={setSelectedTheme} systemTheme={systemTheme || 'system'} />
          )}

        </form>
      </CardContent>
      <CardFooter className="border-t px-6 py-4 flex justify-end">
        <Button onClick={changeTheme} disabled={!mounted}>
          Guardar
        </Button>
      </CardFooter>
    </Card>
  )
}

export const ThemeSelector = ({ systemTheme, setSelectedTheme, selectedTheme }: { setSelectedTheme: (theme: string) => void, selectedTheme: string, systemTheme: string }) => {
  const system = systemTheme !== 'dark' ? 'bg-white' : 'bg-zinc-800'

  return (
    <>
      <ThemeBlock text='Sistema' theme='system' color={system} selected={selectedTheme} setSelected={setSelectedTheme} />
      <ThemeBlock text='Oscuro' theme='dark' color='bg-zinc-800' selected={selectedTheme} setSelected={setSelectedTheme} />
      <ThemeBlock text='Claro' theme='light' color='bg-white' selected={selectedTheme} setSelected={setSelectedTheme} />
    </>
  )
}

const ThemeBlock = ({ theme, color, selected, setSelected, text }: { theme: string, color: string, selected: string, setSelected: (theme: string) => void, text: string }) => {
  return (
    <label className="flex space-y-2 cursor-pointer flex-col">
      <div className={cn('w-full h-6 rounded-md border border-zinc-200 dark:border-zinc-700', color)} />
      <div className="flex items-center space-x-2">
        <input
          id={theme}
          type="radio"
          name="theme"
          value={color}
          checked={selected === theme}
          onChange={() => setSelected(theme)}
        />
        <label htmlFor={theme} className="text-sm">{text}</label>
      </div>
    </label>
  )
}

const ThemeSelectorSkeleton = () => {
  return (
    <>
      <SelectorSkeleton />
      <SelectorSkeleton />
      <SelectorSkeleton />
    </>
  )
}

const SelectorSkeleton = () => (
  <label className="flex space-y-2 cursor-pointer flex-col">
    <div className='w-full h-6 rounded-md border border-zinc-200 dark:border-zinc-700' />
    <div className="flex items-center space-x-2">
      <input
        type="radio"
        name="theme"
      />
      <Skeleton className="w-16 h-5" />
    </div>
  </label>
)
