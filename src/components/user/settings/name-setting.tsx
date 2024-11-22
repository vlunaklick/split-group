'use client'

import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { changeNameSchema } from '@/lib/form'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { updateName } from '../../../app/(user)/settings/actions'
import { displayToast } from '@/utils/toast-display'

export const NameSettings = () => {
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<z.infer<typeof changeNameSchema>>({
    resolver: zodResolver(changeNameSchema),
    defaultValues: {
      name: ''
    }
  })

  const onSubmit = async (values: z.infer<typeof changeNameSchema>) => {
    setIsLoading(true)
    try {
      await updateName({ newName: values.name })
    } catch (error) {
      displayToast('Hubo un error al actualizar tu nombre', 'error')
      setIsLoading(false)
      return
    }

    displayToast('Tu nombre actualizado correctamente.', 'success')
    setIsLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nombre de la cuenta</CardTitle>
        <CardDescription>
          Nombre que se mostrará en la plataforma para el resto de usuarios.
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
                    <Input
                      id='name'
                      placeholder="Jhon doe"
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
