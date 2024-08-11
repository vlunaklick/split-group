'use client'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { updateThemeSettingsSchema } from '@/lib/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

export const ThemeSetting = () => {
  const { setTheme, resolvedTheme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isLogging, setIsLogging] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const form = useForm<z.infer<typeof updateThemeSettingsSchema>>({
    resolver: zodResolver(updateThemeSettingsSchema),
    values: {
      theme: resolvedTheme || 'system'
    }
  })

  const onSubmit = async (values: z.infer<typeof updateThemeSettingsSchema>) => {
    const { theme } = values
    setIsLogging(true)

    try {
      setTheme(theme)
      toast.success('Tema actualizado correctamente')
    } catch (error) {
      toast.error('Hubo un error al actualizar el tema')
    }
    setIsLogging(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Selecciona el tema</CardTitle>
        <CardDescription>
          Personaliza la apariencia de la aplicación seleccionando un tema.
        </CardDescription>
      </CardHeader>
      {
        mounted
          ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} key={form.watch('theme') ? 1 : 0}>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="theme"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormMessage />
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid gap-8 pt-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full"
                        >
                          <FormItem>
                            <FormLabel className="[&:has([data-state=checked])>div]:border-muted-foreground">
                              <FormControl>
                                <RadioGroupItem value="system" className="sr-only" />
                              </FormControl>
                              <ThemeBlock text="Sistema" bgColor={systemTheme === 'dark' ? 'bg-zinc-950' : 'bg-[#ecedef]'} textColor={systemTheme === 'dark' ? 'bg-zinc-400' : 'bg-[#ecedef]'} cardColor={systemTheme === 'dark' ? 'bg-zinc-800' : 'bg-white'} />
                            </FormLabel>
                          </FormItem>

                          <FormItem>
                            <FormLabel className="[&:has([data-state=checked])>div]:border-muted-foreground">
                              <FormControl>
                                <RadioGroupItem value="light" className="sr-only" />
                              </FormControl>
                              <ThemeBlock text="Claro" bgColor="bg-[#ecedef]" textColor="bg-[#ecedef]" cardColor="bg-white" />
                            </FormLabel>
                          </FormItem>

                          <FormItem>
                            <FormLabel className="[&:has([data-state=checked])>div]:border-muted-foreground">
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
                <CardFooter className="border-t px-6 py-4 flex justify-end">
                  <Button type="submit" disabled={isLogging || !mounted}>
                    Guardar
                  </Button>
                </CardFooter>
              </form>
            </Form>
            )
          : (
            <>
              <CardContent className="grid gap-8 pt-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full">
                <ThemeBlockSkeleton text="Sistema" />
                <ThemeBlockSkeleton text="Claro" />
                <ThemeBlockSkeleton text="Oscuro" />
              </CardContent>
              <CardFooter className="border-t px-6 py-4 flex justify-end">
                <Button type="submit" disabled={isLogging || !mounted}>
                  Guardar
                </Button>
              </CardFooter>
            </>
            )
      }
    </Card>
  )
}

const ThemeBlock = ({ text, bgColor, textColor, cardColor }: { text: string, bgColor: string, textColor: string, cardColor: string }) => {
  return (
    <>
      <div className="items-center rounded-md border-2 border-border p-1 hover:border-zinc-300 dark:hover:border-zinc-600">
        <div className={`space-y-2 rounded-sm ${bgColor} p-2`}>
          <div className={`space-y-2 rounded-md ${cardColor} p-2 shadow-sm`}>
            <div className={`h-2 w-[80px] rounded-lg ${textColor}`} />
            <div className={`h-2 w-[100px] rounded-lg ${textColor}`} />
          </div>
          <div className={`flex items-center space-x-2 rounded-md ${cardColor} p-2 shadow-sm`}>
            <div className={`h-4 w-4 rounded-full ${textColor}`} />
            <div className={`h-2 w-[100px] rounded-lg ${textColor}`} />
          </div>
          <div className={`flex items-center space-x-2 rounded-md ${cardColor} p-2 shadow-sm`}>
            <div className={`h-4 w-4 rounded-full ${textColor}`} />
            <div className={`h-2 w-[100px] rounded-lg ${textColor}`} />
          </div>
        </div>
      </div>
      <span className="block w-full p-2 text-center font-normal">
        {text}
      </span>
    </>
  )
}

export const ThemeBlockSkeleton = ({ text }: { text: string }) => {
  return (
    <div className='flex flex-col'>
      <div className="items-center rounded-md border-2 border-zinc-100 dark:border-zinc-800 p-1 hover:border-zinc-300 dark:hover:border-zinc-600 animate-pulse">
        <div className={'space-y-2 rounded-sm bg-zinc-600 p-2'}>
          <div className={'space-y-2 rounded-md bg-zinc-500 p-2 shadow-sm'}>
            <div className={'h-2 w-[80px] rounded-lg bg-muted-foreground'} />
            <div className={'h-2 w-[100px] rounded-lg bg-muted-foreground'} />
          </div>
          <div className={'flex items-center space-x-2 rounded-md bg-zinc-500 p-2 shadow-sm'}>
            <div className={'h-4 w-4 rounded-full bg-muted-foreground'} />
            <div className={'h-2 w-[100px] rounded-lg bg-muted-foreground'} />
          </div>
          <div className={'flex items-center space-x-2 rounded-md bg-zinc-500 p-2 shadow-sm'}>
            <div className={'h-4 w-4 rounded-full bg-muted-foreground'} />
            <div className={'h-2 w-[100px] rounded-lg bg-muted-foreground'} />
          </div>
        </div>
      </div>
      <span className="block w-full p-2 text-center font-normal text-sm">
        {text}
      </span>
    </div>
  )
}
