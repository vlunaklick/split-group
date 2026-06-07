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
import { z } from 'zod'
import { updateLimit } from '../../../app/(user)/settings/notifications/actions'
import { displayToast } from '@/utils/toast-display'

export const LimitSetting = () => {
  const { data: configuration, isLoading: isLoadingConfiguration } = useGetUserConfiguration()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof updateAlertLimitSettingsSchema>>({
    resolver: zodResolver(updateAlertLimitSettingsSchema),
    defaultValues: { amount: 0 },
    values: { amount: configuration?.limit || 0 }
  })

  const onSubmit = async (values: z.infer<typeof updateAlertLimitSettingsSchema>) => {
    setIsLoading(true)
    try {
      await updateLimit({ newLimit: values.amount })
      displayToast('Límite actualizado', 'success')
    } catch (error) {
      displayToast('No se pudo actualizar el límite', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Límite de gasto mensual</CardTitle>
        <CardDescription>
          Te avisamos si tu deuda del mes supera este monto. Dejalo en 0 para desactivar.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex max-w-xs">
                      <div className="flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">
                        $
                      </div>
                      <Input
                        placeholder="0"
                        className="rounded-l-none"
                        type="number"
                        min={0}
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
