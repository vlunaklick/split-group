'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { useState } from 'react'
import { IconLoader2 } from '@tabler/icons-react'
import { useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'

const formSchema = z.object({
  email: z.string().email({ message: 'Debe ser un correo electrónico válido' })
})

export const ForgotPasswordForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isWaiting, setIsWaiting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ''
    }
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { email } = values
    setIsWaiting(true)
    const forgotPasswordToken = await axios.post('/api/users/password', { email })
    setIsWaiting(false)

    if (!forgotPasswordToken) {
      return
    }

    router.refresh()
    const redirectUrl = searchParams.get('from') || '/'
    router.push(redirectUrl)
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
