'use client'

import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { updateUsername } from './actions'
import { z } from 'zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { changeUsernameSchema } from '@/lib/form'

export const UsernameSettings = ({ userId }: { userId: string }) => {
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<z.infer<typeof changeUsernameSchema>>({
    resolver: zodResolver(changeUsernameSchema),
    defaultValues: {
      username: ''
    }
  })

  const onSubmit = async (values: z.infer<typeof changeUsernameSchema>) => {
    if (!userId) return
    setIsLoading(true)
    try {
      await updateUsername({ userId, newUsername: values.username })
    } catch (error) {
      toast.error('Hubo un error al actualizar tu nombre de usuario.', {
        duration: 3000
      })
      setIsLoading(false)
      return
    }

    toast.success('Nombre de usuario actualizado correctamente.', {
      duration: 3000
    })
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
