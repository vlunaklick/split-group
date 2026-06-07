'use client'

import { createGroup } from '@/actions/groups'
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

interface CreateGroupFormProps {
  callback?: () => void
}

export function CreateGroupForm ({ callback }: CreateGroupFormProps) {
  const router = useRouter()
  const { mutate } = useSWRConfig()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDescription, setShowDescription] = useState(false)

  const form = useForm<z.infer<typeof createGroupFormSchema>>({
    resolver: zodResolver(createGroupFormSchema),
    defaultValues: {
      name: '',
      description: '',
      icon: 'alien'
    }
  })

  const onSubmit = async (values: z.infer<typeof createGroupFormSchema>) => {
    setIsSubmitting(true)

    try {
      const group = await createGroup(values)
      mutate(['user-groups'])
      mutate('user-onboarding')
      displayToast('Grupo creado', 'success')
      form.reset()
      callback?.()
      router.push(`/groups/${group.id}`)
    } catch (error) {
      displayToast('No se pudo crear el grupo', 'error')
    } finally {
      setIsSubmitting(false)
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
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input autoFocus placeholder="Ej: Viaje, casa, fútbol…" disabled={isSubmitting} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }: any) => (
            showDescription
              ? (
                <FormItem className="grid gap-2 space-y-0">
                  <FormLabel>Descripción (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Para qué es este grupo…" disabled={isSubmitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
                )
              : (
                <Button type="button" variant="link" className="h-auto justify-start p-0" onClick={() => setShowDescription(true)}>
                  + Agregar descripción
                </Button>
                )
          )}
        />

        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Icono</FormLabel>
              <FormMessage />
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-wrap gap-3"
              >
                {GROUP_ICONS.map(({ name, Icon }) => (
                  <IconSelector key={name} name={name} label={name}>
                    <Icon className="h-6 w-6" />
                  </IconSelector>
                ))}
              </RadioGroup>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <IconLoader2 className="animate-spin" /> : 'Crear grupo'}
        </Button>
      </form>
    </Form>
  )
}

/** @deprecated Use CreateGroupForm */
export const CreateGroupFrom = CreateGroupForm

const IconSelector = ({ children, name, label }: { children: React.ReactNode; name: string; label: string }) => {
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
        <div className="flex h-12 w-12 items-center justify-center rounded-md border border-muted-foreground/80 text-muted-foreground/80 transition-colors hover:border-primary hover:text-primary">
          {children}
        </div>
        <span className="sr-only">{label}</span>
      </FormLabel>
    </FormItem>
  )
}
