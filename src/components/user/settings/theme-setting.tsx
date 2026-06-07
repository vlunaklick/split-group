'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { updateThemeSettingsSchema } from '@/lib/form'
import { displayToast } from '@/utils/toast-display'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTheme } from '@/components/theme-provider'
import type { Theme } from '@/lib/theme'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const ThemeSetting = () => {
  const { setTheme, resolvedTheme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const form = useForm<z.infer<typeof updateThemeSettingsSchema>>({
    resolver: zodResolver(updateThemeSettingsSchema),
    values: { theme: resolvedTheme || 'system' }
  })

  const handleThemeChange = (theme: string) => {
    form.setValue('theme', theme)
    setTheme(theme as Theme)
    displayToast('Tema actualizado', 'success')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tema</CardTitle>
        <CardDescription>
          Cambiá la apariencia de la app. Se aplica al instante.
        </CardDescription>
      </CardHeader>
      {mounted
        ? (
          <Form {...form}>
            <form>
              <CardContent>
                <FormField
                  control={form.control}
                  name="theme"
                  render={({ field }) => (
                    <FormItem>
                      <FormMessage />
                      <RadioGroup
                        onValueChange={handleThemeChange}
                        value={field.value}
                        className="grid w-full grid-cols-1 gap-6 pt-2 md:grid-cols-3"
                      >
                        <FormItem>
                          <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                            <FormControl>
                              <RadioGroupItem value="system" className="sr-only" />
                            </FormControl>
                            <ThemeBlock text="Sistema" bgColor={systemTheme === 'dark' ? 'bg-zinc-950' : 'bg-[#ecedef]'} textColor={systemTheme === 'dark' ? 'bg-zinc-400' : 'bg-[#ecedef]'} cardColor={systemTheme === 'dark' ? 'bg-zinc-800' : 'bg-white'} />
                          </FormLabel>
                        </FormItem>
                        <FormItem>
                          <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                            <FormControl>
                              <RadioGroupItem value="light" className="sr-only" />
                            </FormControl>
                            <ThemeBlock text="Claro" bgColor="bg-[#ecedef]" textColor="bg-[#ecedef]" cardColor="bg-white" />
                          </FormLabel>
                        </FormItem>
                        <FormItem>
                          <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                            <FormControl>
                              <RadioGroupItem value="dark" className="sr-only" />
                            </FormControl>
                            <ThemeBlock text="Oscuro" bgColor="bg-zinc-950" textColor="bg-zinc-400" cardColor="bg-zinc-800" />
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormItem>
                  )}
                />
              </CardContent>
            </form>
          </Form>
          )
        : (
          <CardContent className="grid w-full grid-cols-1 gap-6 pt-2 md:grid-cols-3">
            <ThemeBlockSkeleton text="Sistema" />
            <ThemeBlockSkeleton text="Claro" />
            <ThemeBlockSkeleton text="Oscuro" />
          </CardContent>
          )}
    </Card>
  )
}

const ThemeBlock = ({ text, bgColor, textColor, cardColor }: { text: string, bgColor: string, textColor: string, cardColor: string }) => {
  return (
    <>
      <div className="items-center rounded-md border-2 border-border p-1 transition-colors hover:border-primary/50">
        <div className={`space-y-2 rounded-sm ${bgColor} p-2`}>
          <div className={`space-y-2 rounded-md ${cardColor} p-2 shadow-sm`}>
            <div className={`h-2 w-[80px] rounded-lg ${textColor}`} />
            <div className={`h-2 w-[100px] rounded-lg ${textColor}`} />
          </div>
          <div className={`flex items-center space-x-2 rounded-md ${cardColor} p-2 shadow-sm`}>
            <div className={`h-4 w-4 rounded-full ${textColor}`} />
            <div className={`h-2 w-[100px] rounded-lg ${textColor}`} />
          </div>
        </div>
      </div>
      <span className="block w-full p-2 text-center text-sm font-normal">{text}</span>
    </>
  )
}

export const ThemeBlockSkeleton = ({ text }: { text: string }) => {
  return (
    <div className="flex flex-col">
      <div className="animate-pulse items-center rounded-md border-2 border-border p-1">
        <div className="space-y-2 rounded-sm bg-muted p-2">
          <div className="h-16 rounded-md bg-muted-foreground/20" />
        </div>
      </div>
      <span className="block w-full p-2 text-center text-sm font-normal">{text}</span>
    </div>
  )
}
