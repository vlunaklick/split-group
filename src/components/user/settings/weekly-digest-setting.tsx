'use client'

import { sendWeeklyDigestToCurrentUser, updateWeeklyDigestEmail } from '@/app/(user)/settings/digest-actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { useGetUserConfiguration } from '@/data/settings'
import { updateWeeklyDigestSettingsSchema } from '@/lib/form'
import { displayToast } from '@/utils/toast-display'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export function WeeklyDigestSetting () {
  const { data: configuration, isLoading: isLoadingConfiguration } = useGetUserConfiguration()
  const [isSaving, setIsSaving] = useState(false)
  const [isSending, setIsSending] = useState(false)

  const form = useForm<z.infer<typeof updateWeeklyDigestSettingsSchema>>({
    resolver: zodResolver(updateWeeklyDigestSettingsSchema),
    defaultValues: { enabled: false },
    values: {
      enabled: configuration?.weeklyDigestEmail ?? false
    }
  })

  const onSubmit = async (values: z.infer<typeof updateWeeklyDigestSettingsSchema>) => {
    setIsSaving(true)
    try {
      await updateWeeklyDigestEmail({ enabled: values.enabled })
      displayToast('Preferencias guardadas', 'success')
    } catch {
      displayToast('No se pudieron guardar las preferencias', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSend = async () => {
    setIsSending(true)
    try {
      await sendWeeklyDigestToCurrentUser()
      displayToast('Resumen enviado a tu email', 'success')
    } catch (error) {
      displayToast(error instanceof Error ? error.message : 'No se pudo enviar', 'error')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Resumen semanal
        </CardTitle>
        <CardDescription>
          Balance, deudas pendientes y gastos de la semana, directo a tu email.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-5">
            <FormField
              control={form.control}
              name="enabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start gap-3 space-y-0 rounded-lg border border-border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSaving || isLoadingConfiguration}
                      className="mt-0.5"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-medium">Recibir cada lunes</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Te enviamos un resumen semanal con cuánto debés, cuánto te deben, movimientos recientes y lo pendiente por grupo.
                    </p>
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-wrap items-center justify-between gap-3 border-t px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleSend}
              disabled={isSending || isSaving || isLoadingConfiguration}
            >
              {isSending ? 'Enviando…' : 'Enviarme resumen ahora'}
            </Button>
            <Button type="submit" disabled={isSaving || isLoadingConfiguration}>
              Guardar
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
