'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getAvailableCurrency } from '@/lib/data'
import { updateCurrencySettingsSchema } from '@/lib/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import useSWR from 'swr'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'

export const CurrencySetting = () => {
  const { data: currencies, isLoading: isLoadingAvailables } = useSWR('currencies-settings', getAvailableCurrency)
  const { data: currency, isLoading: isLoadingCurrent } = useSWR('currency-setting', async () => {
    const currency = localStorage.getItem('currency')
    return currency
  })

  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<z.infer<typeof updateCurrencySettingsSchema>>({
    resolver: zodResolver(updateCurrencySettingsSchema),
    values: {
      currency: currencies?.find((curr) => curr.id === currency)?.id || ''
    }
  })

  const onSubmit = async (values: z.infer<typeof updateCurrencySettingsSchema>) => {
    setIsLoading(true)
    try {
      localStorage.setItem('currency', values.currency)
    } catch (error) {
      toast.error('Hubo un error al actualizar tu moneda', {
        duration: 3000
      })
      setIsLoading(false)
      return
    }

    toast.success('Tu moneda ha sido actualizada correctamente.', {
      duration: 3000
    })
    setIsLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Moneda por defecto</CardTitle>
        <CardDescription>
          Selecciona la moneda que deseas utilizar en la aplicación. Esta se utilizará para mostrar las estadísticas y resumenes financieros.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} key={(!isLoadingAvailables && form.watch('currency') ? 0 : 1)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger disabled={isLoadingAvailables || isLoadingCurrent}>
                        <SelectValue placeholder="Selecciona una moneda" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {currencies?.map((currency) => (
                        <SelectItem key={currency.id} value={currency.id}>
                          {currency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="border-t px-6 py-4 flex justify-end">
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
        <SelectItem value="loading">
          Cargando...
        </SelectItem>
      </SelectContent>
    </Select>
)
