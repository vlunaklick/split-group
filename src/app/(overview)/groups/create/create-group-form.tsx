'use client'

import { GROUP_ICONS } from '@/components/group-icons'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup } from '@/components/ui/radio-group'
import { createGroupFormSchema } from '@/lib/form'
import { cn } from '@/lib/utils'
import { displayToast } from '@/utils/toast-display'
import { zodResolver } from '@hookform/resolvers/zod'
import { RadioGroupItem } from '@radix-ui/react-radio-group'
import { IconLoader2 } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSWRConfig } from 'swr'
import { z } from 'zod'
import { createGroup } from './actions'

export const CreateGroupFrom = () => {
  const router = useRouter()
  const { mutate } = useSWRConfig()
  const [isLogging, setIsLogging] = useState(false)

  const form = useForm<z.infer<typeof createGroupFormSchema>>({
    resolver: zodResolver(createGroupFormSchema),
    defaultValues: {
      name: '',
      description: '',
      icon: 'alien'
    }
  })

  const onSubmit = async (values: z.infer<typeof createGroupFormSchema>) => {
    const { name, description, icon } = values
    setIsLogging(true)

    try {
      const group = await createGroup({ name, description, icon })
      mutate(['user-groups'])

      displayToast('Grupo creado con éxito. Redirigiendo...', 'success')
      setTimeout(() => {
        router.push(`/groups/${group.id}`)
      }, 2000)
    } catch (error) {
      displayToast('No se ha podido crear el grupo', 'error')
      setIsLogging(false)
    }
  }

  return (
    <Form {...form}>
      <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }: any) => (
            <FormItem className="grid gap-2 space-y-0">
              <FormLabel>
                Nombre de grupo
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Nombre de grupo"
                  disabled={isLogging}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }: any) => (
            <FormItem className="grid gap-2 space-y-0">
              <FormLabel>
                Descripción del grupo
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Este grupo es para..."
                  disabled={isLogging}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Icono</FormLabel>
              <FormMessage />
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex gap-3 flex-wrap"
              >
                {
                  GROUP_ICONS.map(({ name, Icon }) => (
                    <IconSelector key={name} name={name} label={name}>
                      <Icon className="h-6 w-6" />
                    </IconSelector>
                  ))
                }
              </RadioGroup>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLogging}>
          {isLogging ? <IconLoader2 className="animate-spin" /> : 'Crear grupo'}
          <span className='sr-only'>Crear grupo</span>
        </Button>
      </form>
    </Form>
  )
}

export const IconSelector = ({ children, name, label }: { children: React.ReactNode; name: string; label: string }) => {
  return (
    <FormItem>
      <FormLabel className={cn(
        'cursor-pointer',
        '[&:has([data-state=checked])>div]:border-primary',
        '[&:has([data-state=checked])>div]:text-primary'
      )}>
        <FormControl>
          <RadioGroupItem value={name} className="sr-only" />
        </FormControl>
        <div className="flex justify-center items-center w-12 h-12 rounded-md border text-muted-foreground/80 border-muted-foreground/80 hover:border-primary hover:text-primary transition-colors">
          {children}
        </div>
        <span className="sr-only">{label}</span>
      </FormLabel>
    </FormItem>
  )
}
