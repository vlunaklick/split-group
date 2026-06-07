'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { changeNameSchema } from '@/lib/form'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { updateName } from '../../../app/(user)/settings/actions'
import { displayToast } from '@/utils/toast-display'
import { useGetSession } from '@/data/session'

export const NameSettings = () => {
  const { data: session } = useGetSession()
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<z.infer<typeof changeNameSchema>>({
    resolver: zodResolver(changeNameSchema),
    defaultValues: { name: '' }
  })

  useEffect(() => {
    if (session?.user?.name) {
      form.reset({ name: session.user.name })
    }
  }, [session?.user?.name, form])

  const onSubmit = async (values: z.infer<typeof changeNameSchema>) => {
    setIsLoading(true)
    try {
      await updateName({ newName: values.name })
      displayToast('Nombre actualizado', 'success')
    } catch (error) {
      displayToast('No se pudo actualizar el nombre', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tu nombre</CardTitle>
        <CardDescription>
          Así te ven el resto de participantes en grupos y gastos.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <FormField
              control={form.control}
              name="name"
              render={({ field }: any) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Tu nombre" {...field} disabled={isLoading} />
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
