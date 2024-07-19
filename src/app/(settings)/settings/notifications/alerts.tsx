'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import useSWR from 'swr'
import { getUserConfiguration } from '@/lib/data'
import { updateAlertsSettingsSchema } from '@/lib/form'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { updateLimit } from './actions'
import { toast } from 'sonner'

export const LimitSetting = ({ userId }: { userId: string }) => {
  const { data: configuration, isLoading: isLoadingConfiguration } = useSWR(`/api/users/${userId}/max-alert`, async () => await getUserConfiguration(userId))
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<z.infer<typeof updateAlertsSettingsSchema>>({
    resolver: zodResolver(updateAlertsSettingsSchema),
    defaultValues: {
      amount: 0
    },
    values: {
      amount: configuration?.limit || 0
    }
  })

  const onSubmit = async (values: z.infer<typeof updateAlertsSettingsSchema>) => {
    if (!userId) return
    setIsLoading(true)
    try {
      await updateLimit({ userId, newLimit: values.amount })
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
                      <div className="flex items-center px-3 bg-zinc-800 text-zinc-400 rounded-l-md">
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
