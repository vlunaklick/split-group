'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useState } from 'react'
import { IconLoader2 } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { updatePassword } from './actions'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { resetPasswordSchema } from '@/lib/form'

export const ResetPasswordForm = ({ code }: { code: string }) => {
  const router = useRouter()
  const [isWaiting, setIsWaiting] = useState(false)

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  })

  const onSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
    const { password } = values
    setIsWaiting(true)
    try {
      await updatePassword(password, code)

      router.refresh()
      router.push('/login')
    } catch (error) {
      console.error(error)
    }
    setIsWaiting(false)
  }

  return (
    <Form {...form}>
      <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="password"
          render={({ field }: any) => (
            <FormItem className="grid gap-2 space-y-0">
              <FormLabel>
                <Label htmlFor='password'>Nueva contraseña</Label>
              </FormLabel>
              <FormControl className='mt-0'>
                <Input
                  id='password'
                  type="password"
                  placeholder="********"
                  className='mt-0'
                  {...field}
                  disabled={isWaiting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }: any) => (
            <FormItem className="grid gap-2 space-y-0">
              <FormLabel>
                <Label htmlFor='confirmPassword'>Confirmar contraseña</Label>
              </FormLabel>
              <FormControl className='mt-0'>
                <Input
                  id='confirmPassword'
                  type="password"
                  placeholder="********"
                  className='mt-0'
                  {...field}
                  disabled={isWaiting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isWaiting}>
          {isWaiting ? <IconLoader2 className="animate-spin" /> : 'Actualizar contraseña'}
          <span className='sr-only'>Actualizar contraseña</span>
        </Button>
      </form>
    </Form>
  )
}
