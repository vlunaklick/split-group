'use client'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { loginSchema } from '@/lib/form'
import { displayToast } from '@/utils/toast-display'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconLoader2 } from '@tabler/icons-react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const LoginForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  })

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    const { username, password } = values
    setIsLoading(true)

    const signInResult = await signIn('credentials', {
      username,
      password,
      redirect: false
    })

    if (!signInResult?.ok) {
      setIsLoading(false)

      return form.setError('password', {
        type: 'manual',
        message: 'Credenciales inválidas'
      })
    }

    displayToast('Bienvenido de vuelta!', 'success')
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
                Nombre de usuario
              </FormLabel>
              <FormControl className='mt-0'>
                <Input
                  placeholder="John Doe"
                  disabled={isLoading}
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
              <div className="flex items-center">
                <FormLabel>
                  Contraseña
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
                  placeholder="********"
                  disabled={isLoading}
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? <IconLoader2 className="animate-spin" /> : 'Iniciar sesión'}
          <span className='sr-only'>Iniciar sesión</span>
        </Button>
      </form>
    </Form>
  )
}
