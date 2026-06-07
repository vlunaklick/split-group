'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useGetAvailableCurrencies, useGetSelectedCurrency } from '@/data/settings'
import { updateCurrencySettingsSchema } from '@/lib/form'
import { displayToast } from '@/utils/toast-display'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const CurrencySetting = () => {
  const { data: currencies, isLoading: isLoadingAvailables } = useGetAvailableCurrencies()
  const { data: currency, isLoading: isLoadingCurrent } = useGetSelectedCurrency()

  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<z.infer<typeof updateCurrencySettingsSchema>>({
    resolver: zodResolver(updateCurrencySettingsSchema),
    values: {
      currency: currencies?.find((curr: any) => curr.name === currency)?.id ?? ''
    }
  })

  const onSubmit = async (values: z.infer<typeof updateCurrencySettingsSchema>) => {
    setIsLoading(true)
    try {
      const name = currencies.find((curr: any) => curr.id === values.currency)?.name || ''
      localStorage.setItem('currency', name)
      displayToast('Moneda actualizada', 'success')
    } catch (error) {
      displayToast('No se pudo actualizar la moneda', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Moneda del panel</CardTitle>
        <CardDescription>
          Usada para mostrar totales en el inicio y estadísticas personales.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger disabled={isLoadingAvailables || isLoadingCurrent}>
                        <SelectValue placeholder="Elegí una moneda" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {currencies?.map((item: any) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-end border-t px-6 py-4">
            <Button type="submit" disabled={isLoading || isLoadingAvailables || isLoadingCurrent}>
              Guardar
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}

export const SelectSkeleton = () => (
  <Select disabled>
    <SelectTrigger className="w-[180px]">
      <SelectValue placeholder="Moneda" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="loading">Cargando…</SelectItem>
    </SelectContent>
  </Select>
)
