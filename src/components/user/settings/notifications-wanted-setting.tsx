'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { updateNotificationsWantedSettingsSchema } from '@/lib/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { updateNotificationsWanted } from '../../../app/(user)/settings/notifications/actions'
import { useGetUserConfiguration } from '@/data/settings'
import { displayToast } from '@/utils/toast-display'

const OPTIONS = [
  {
    name: 'invitations' as const,
    label: 'Invitaciones a grupos',
    description: 'Cuando alguien te invite a un grupo nuevo.'
  },
  {
    name: 'payments' as const,
    label: 'Pagos y deudas',
    description: 'Cuando marquen una deuda como pagada o perdonada.'
  },
  {
    name: 'spents' as const,
    label: 'Cambios en gastos',
    description: 'Cuando editen un gasto en el que participás.'
  }
]

export const NotificationsWantedSettings = () => {
  const { data: configuration, isLoading: isLoadingConfiguration } = useGetUserConfiguration()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof updateNotificationsWantedSettingsSchema>>({
    resolver: zodResolver(updateNotificationsWantedSettingsSchema),
    defaultValues: { invitations: false, payments: false, spents: false },
    values: {
      invitations: configuration?.inviteNotification || false,
      payments: configuration?.paymentNotification || false,
      spents: configuration?.spentNotification || false
    }
  })

  const onSubmit = async (values: z.infer<typeof updateNotificationsWantedSettingsSchema>) => {
    setIsLoading(true)
    try {
      await updateNotificationsWanted({
        invitations: values.invitations || false,
        payments: values.payments || false,
        spents: values.spents || false
      })
      displayToast('Preferencias guardadas', 'success')
    } catch (error) {
      displayToast('No se pudieron guardar las preferencias', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Qué avisos recibir</CardTitle>
        <CardDescription>
          Elegí qué eventos te avisan dentro de la app.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-5">
            {OPTIONS.map((option) => (
              <FormField
                key={option.name}
                control={form.control}
                name={option.name}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start gap-3 space-y-0 rounded-lg border border-border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading || isLoadingConfiguration}
                        className="mt-0.5"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="font-medium">{option.label}</FormLabel>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                  </FormItem>
                )}
              />
            ))}
          </CardContent>
          <CardFooter className="flex justify-end border-t px-6 py-4">
            <Button type="submit" disabled={isLoading || isLoadingConfiguration}>
              Guardar
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
