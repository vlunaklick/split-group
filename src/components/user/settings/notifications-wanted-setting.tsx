'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { updateNotificationsWantedSettingsSchema } from '@/lib/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { updateNotificationsWanted } from '../../../app/(user)/settings/notifications/actions'
import { useGetUserConfiguration } from '@/data/settings'
import { displayToast } from '@/utils/toast-display'

export const NotificationsWantedSettings = () => {
  const { data: configuration, isLoading: isLoadingConfiguration } = useGetUserConfiguration()

  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<z.infer<typeof updateNotificationsWantedSettingsSchema>>({
    resolver: zodResolver(updateNotificationsWantedSettingsSchema),
    defaultValues: {
      invitations: false,
      payments: false,
      spents: false
    },
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
    } catch (error) {
      displayToast('Ha ocurrido un error, por favor intenta de nuevo.', 'error')
      setIsLoading(false)
      return
    }

    displayToast('Las notificaciones deseadas han sido actualizadas.', 'success')
    setIsLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notificaciones deseadas</CardTitle>
        <CardDescription>
          Elije las notificaciones que deseas recibir, desde invitaciones a grupos hasta actualizaciones de gastos y pagos de deudas.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="invitations"
              render={({ field }: any) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading || isLoadingConfiguration}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Invitaciones de grupos
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="payments"
              render={({ field }: any) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading || isLoadingConfiguration}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Pagos de deudas
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="spents"
              render={({ field }: any) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading || isLoadingConfiguration}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Actualizaciones de gastos
                    </FormLabel>
                  </div>
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
