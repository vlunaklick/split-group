'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useGetUserConfiguration } from '@/data/settings'
import { updateAlertLimitSettingsSchema } from '@/lib/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { updateLimit } from '../../../app/(user)/settings/notifications/actions'

export const LimitSetting = () => {
  const { data: configuration, isLoading: isLoadingConfiguration } = useGetUserConfiguration()

  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<z.infer<typeof updateAlertLimitSettingsSchema>>({
    resolver: zodResolver(updateAlertLimitSettingsSchema),
    defaultValues: {
      amount: 0
    },
    values: {
      amount: configuration?.limit || 0
    }
  })

  const onSubmit = async (values: z.infer<typeof updateAlertLimitSettingsSchema>) => {
    setIsLoading(true)
    try {
      await updateLimit({ newLimit: values.amount })
    } catch (error) {
      toast.error('Ha ocurrido un error, por favor intenta de nuevo.', {
        duration: 3000
      })
      setIsLoading(false)
      return
    }

    toast.success('El límite de alerta ha sido actualizado.', {
      duration: 3000
    })
    setIsLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alertas ante gastos excesivos</CardTitle>
        <CardDescription>
          Recibe notificaciones cuando tus gastos superen un límite establecido, ayudándote a mantener un control de tus finanzas y evitar gastos innecesarios.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <FormField
              control={form.control}
              name="amount"
              render={({ field }: any) => (
                <FormItem>
                  <FormControl>
                    <div className="flex">
                      <div className="flex items-center px-3 bg-border text-muted-foreground rounded-l-md">
                        $
                      </div>
                      <Input
                        id='amount'
                        placeholder="140000"
                        className='rounded-l-none'
                        type="number"
                        {...field}
                        disabled={isLoading || isLoadingConfiguration}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="border-t px-6 py-4 flex justify-end">
            <Button type="submit" disabled={isLoading || isLoadingConfiguration}>
              Guardar
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
