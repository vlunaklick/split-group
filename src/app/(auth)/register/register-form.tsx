'use client'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { registerSchema } from '@/lib/form'
import { displayToast } from '@/utils/toast-display'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconLoader2 } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { createUser } from './actions'

export const RegisterForm = () => {
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      password: '',
      name: '',
      email: ''
    }
  })

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    const { username, password, name, email } = values
    setIsCreating(true)

    const userCreated = await createUser({
      username,
      password,
      name,
      email
    })

    if (userCreated?.error) {
      if (userCreated?.error?.field) {
        form.setError(userCreated.error?.field as 'name' | 'email' | 'username' | 'password', {
          type: 'manual',
          message: userCreated.error.message
        })
      }

      return setIsCreating(false)
    }

    displayToast('Cuenta creada exitosamente. Serás redirigido a la página de inicio de sesión en 3 segundos.', 'success')
    setTimeout(() => {
      router.push('/login')
    }, 3000)
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
                Nombre
              </FormLabel>
              <FormControl className='mt-0'>
                <Input
                  placeholder="John Doe"
                  disabled={isCreating}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }: any) => (
            <FormItem className="grid gap-2 space-y-0">
              <FormLabel>
                Nombre de usuario
              </FormLabel>
              <FormControl className='mt-0'>
                <Input
                  placeholder="@johndoe"
                  disabled={isCreating}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }: any) => (
            <FormItem className="grid gap-2 space-y-0">
              <FormLabel>
                Email
              </FormLabel>
              <FormControl className='mt-0'>
                <Input
                  placeholder="johndoe@example.com"
                  disabled={isCreating}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }: any) => (
            <FormItem className="grid gap-2 space-y-0">
              <FormLabel>
                Contraseña
              </FormLabel>
              <FormControl className='mt-0'>
                <Input
                  type="password"
                  placeholder="********"
                  disabled={isCreating}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" disabled={isCreating}>
          {isCreating ? <IconLoader2 className="animate-spin" /> : 'Crear cuenta'}
          <span className='sr-only'>Crear cuenta</span>
        </Button>
      </form>
    </Form>
  )
}
