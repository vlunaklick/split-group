'use client'

import { updateUsername } from '@/app/(user)/settings/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { changeUsernameSchema } from '@/lib/form'
import { useGetSession } from '@/data/session'
import { displayToast } from '@/utils/toast-display'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const UsernameSettings = () => {
  const { data: session } = useGetSession()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof changeUsernameSchema>>({
    resolver: zodResolver(changeUsernameSchema),
    defaultValues: { username: '' }
  })

  useEffect(() => {
    if (session?.user?.username) {
      form.reset({ username: session.user.username })
    }
  }, [session?.user?.username, form])

  const onSubmit = async (values: z.infer<typeof changeUsernameSchema>) => {
    setIsLoading(true)
    try {
      await updateUsername({ newUsername: values.username })
      displayToast('Usuario actualizado', 'success')
    } catch (error) {
      displayToast('No se pudo actualizar el usuario', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usuario</CardTitle>
        <CardDescription>
          Lo usás para iniciar sesión. Solo letras y números.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="tuusuario" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-end border-t px-6 py-4">
            <Button type="submit" disabled={isLoading}>
              Guardar
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
