'use client'

import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { createGroupFormSchema } from '@/lib/form'
import { createGroup } from './actions'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { RadioGroup } from '@/components/ui/radio-group'
import { RadioGroupItem } from '@radix-ui/react-radio-group'
import { useSWRConfig } from 'swr'
import { GROUP_ICONS } from '@/components/group-icons'
import { IconLoader2 } from '@tabler/icons-react'

export const CreateGroupFrom = ({ userId }: { userId: string }) => {
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
      const group = await createGroup({ userId, name, description, icon })
      mutate('user-groups')
      toast.success('Grupo creado con éxito. Redirigiendo...')
      setTimeout(() => {
        router.push(`/groups/${group.id}`)
      }, 2000)
    } catch (error) {
      toast.error('No se ha podido crear el grupo')
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
                    <FormItem key={name}>
                      <FormLabel className="dark:[&:has([data-state=checked])>div]:border-muted-foreground dark:[&:has([data-state=checked])>div]:text-white [&:has([data-state=checked])>div]:text-black [&:has([data-state=checked])>div]:border-zinc-600">
                        <FormControl>
                          <RadioGroupItem value={name} className="sr-only" />
                        </FormControl>
                        <IconSelector>
                          <Icon />
                        </IconSelector>
                      </FormLabel>
                    </FormItem>
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

export const IconSelector = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex justify-center items-center w-12 h-12 rounded-md border text-muted-foreground/80 border-muted-foreground/80 cursor-pointer">
      {children}
    </div>
  )
}
