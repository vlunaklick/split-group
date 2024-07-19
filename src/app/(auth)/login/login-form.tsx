'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useState } from 'react'
import { IconLoader2 } from '@tabler/icons-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { loginSchema } from '@/lib/form'

export const LoginForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLogging, setIsLogging] = useState(false)

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  })

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    const { username, password } = values
    setIsLogging(true)

    const signInResult = await signIn('credentials', {
      username,
      password,
      redirect: false
    })

    setIsLogging(false)

    if (!signInResult?.ok) {
      return form.setError('password', {
        type: 'manual',
        message: 'Credenciales inválidas'
      })
    }

    router.refresh()
    const redirectUrl = searchParams.get('from') || '/dashboard'
    router.push(redirectUrl)
  }

  return (
    <Form {...form}>
      <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
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
                  placeholder="John Doe"
                  className='mt-0'
                  {...field}
                  disabled={isLogging}
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
              <div className="flex items-center">
                <FormLabel>
                  <Label htmlFor='password'>Contraseña</Label>
                </FormLabel>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Olvidaste tu contraseña?
                </Link>
              </div>
              <FormControl className='mt-0'>
                <Input
                  id='password'
                  type="password"
                  placeholder="********"
                  className='mt-0'
                  {...field}
                  disabled={isLogging}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLogging}>
          {isLogging ? <IconLoader2 className="animate-spin" /> : 'Iniciar sesión'}
          <span className='sr-only'>Iniciar sesión</span>
        </Button>
      </form>
    </Form>
  )
}
