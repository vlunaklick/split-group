'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useGetAlertsSizeSelected } from '@/data/settings'
import { updateAlertSizeSettingsSchema } from '@/lib/form'
import { displayToast } from '@/utils/toast-display'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const AlertSettings = () => {
  const { data: alert, isLoading: isLoadingCurrent } = useGetAlertsSizeSelected()

  const form = useForm<z.infer<typeof updateAlertSizeSettingsSchema>>({
    resolver: zodResolver(updateAlertSizeSettingsSchema),
    values: { size: alert || 'simple' }
  })

  const handleSizeChange = (size: string) => {
    form.setValue('size', size)
    try {
      localStorage.setItem('alert-size', size)
      displayToast('Estilo de avisos actualizado', 'success')
    } catch {
      displayToast('No se pudo guardar la preferencia', 'error')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estilo de avisos</CardTitle>
        <CardDescription>
          Simple muestra lo esencial; Avanzado incluye más detalle en cada toast.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form>
          <CardContent>
            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value)
                      handleSizeChange(value)
                    }}
                    value={field.value}
                    disabled={isLoadingCurrent}
                  >
                    <FormControl>
                      <SelectTrigger className="max-w-xs">
                        <SelectValue placeholder="Elegí un estilo" />
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
        </form>
      </Form>
    </Card>
  )
}
