'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useGetAlertsSizeSelected } from '@/data/settings'
import { updateAlertSizeSettingsSchema } from '@/lib/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

// TODO: evaluar si puedo llevar esto a la db

export const AlertSettings = () => {
  const { data: alert, isLoading: isLoadingCurrent } = useGetAlertsSizeSelected()

  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof updateAlertSizeSettingsSchema>>({
    resolver: zodResolver(updateAlertSizeSettingsSchema),
    values: {
      size: alert || ''
    }
  })

  const onSubmit = async (values: z.infer<typeof updateAlertSizeSettingsSchema>) => {
    setIsLoading(true)
    try {
      localStorage.setItem('alert-size', values.size)
    } catch (error) {
      toast.error('Hubo un error al actualizar el tamaño de las alertas', {
        duration: 3000
      })
      setIsLoading(false)
      return
    }

    toast.success('Tamaño de alertas guardado correctamente', {
      duration: 3000
    })
    setIsLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tamaño de alertas</CardTitle>
        <CardDescription>
          Personaliza el tamaño de las alertas que se muestran en la aplicación.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} key={form.watch('size') ? 0 : 1}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger disabled={isLoadingCurrent}>
                        <SelectValue placeholder="Selecciona una moneda" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    <SelectItem value="simple">Simple</SelectItem>
                    <SelectItem value="advanced">Avanzado</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="border-t px-6 py-4 flex justify-end">
            <Button type="submit" disabled={isLoading || isLoadingCurrent}>
              Guardar
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
