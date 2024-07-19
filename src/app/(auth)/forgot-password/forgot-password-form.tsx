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
import { requestChangePassword } from './actions'
import { toast } from 'sonner'
import { forgotPasswordSchema } from '@/lib/form'

export const ForgotPasswordForm = () => {
  const router = useRouter()
  const [isWaiting, setIsWaiting] = useState(false)

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ''
    }
  })

  const onSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
    const { email } = values
    setIsWaiting(true)
    const forgotPasswordToken = await requestChangePassword(email)

    if (!forgotPasswordToken) {
      setIsWaiting(false)
      return
    }

    toast.success('Se ha enviado un correo con las instrucciones para recuperar tu contraseña.')
    setTimeout(() => {
      router.refresh()
      router.push('/login')
    }, 3000)
  }

  return (
    <Form {...form}>
      <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
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
                  disabled={isWaiting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isWaiting}>
          {isWaiting ? <IconLoader2 className="animate-spin" /> : 'Recuperar contreseña'}
          <span className='sr-only'>Recuperar contraseña</span>
        </Button>
      </form>
    </Form>
  )
}
