'use client'

import { updateUsername } from '@/app/(user)/settings/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { changeUsernameSchema } from '@/lib/form'
import { displayToast } from '@/utils/toast-display'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const UsernameSettings = () => {
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<z.infer<typeof changeUsernameSchema>>({
    resolver: zodResolver(changeUsernameSchema),
    defaultValues: {
      username: ''
    }
  })

  const onSubmit = async (values: z.infer<typeof changeUsernameSchema>) => {
    setIsLoading(true)
    try {
      await updateUsername({ newUsername: values.username })
    } catch (error) {
      displayToast('Hubo un error al actualizar tu nombre de usuario.', 'error')
      setIsLoading(false)
      return
    }

    displayToast('Nombre de usuario actualizado correctamente.', 'success')
    setIsLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nombre de usuario</CardTitle>
        <CardDescription>
          Nombre que se utilizará para acceder a la plataforma.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <FormField
              control={form.control}
              name="username"
              render={({ field }: any) => (
                <FormItem>
                  <FormControl>
                    <Input
                      id='username'
                      placeholder="@johndoe"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="border-t px-6 py-4 flex justify-end">
            <Button type="submit" disabled={isLoading}>
              Guardar
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
