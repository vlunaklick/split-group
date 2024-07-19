'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useState } from 'react'
import { IconLoader2 } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { createUser } from './actions'
import { toast } from 'sonner'
import { registerSchema } from '@/lib/form'

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

    toast.success('Cuenta creada exitosamente. Serás redirigido a la página de inicio de sesión en 3 segundos.')
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
                <Label htmlFor='name'>Nombre</Label>
              </FormLabel>
              <FormControl className='mt-0'>
                <Input
                  id='name'
                  placeholder="John Doe"
                  className='mt-0'
                  {...field}
                  disabled={isCreating}
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
                <Label htmlFor='username'>Nombre de usuario</Label>
              </FormLabel>
              <FormControl className='mt-0'>
                <Input
                  id='username'
                  placeholder="@johndoe"
                  className='mt-0'
                  {...field}
                  disabled={isCreating}
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
                <Label htmlFor='email'>Email</Label>
              </FormLabel>
              <FormControl className='mt-0'>
                <Input
                  id='email'
                  placeholder="johndoe@example.com"
                  className='mt-0'
                  {...field}
                  disabled={isCreating}
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
                <Label htmlFor='password'>Contraseña</Label>
              </FormLabel>
              <FormControl className='mt-0'>
                <Input
                  id='password'
                  type="password"
                  placeholder="********"
                  className='mt-0'
                  {...field}
                  disabled={isCreating}
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