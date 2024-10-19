'use client'

import { NumberField, NumberFieldDecrement, NumberFieldGroup, NumberFieldIncrement, NumberFieldInput } from '@/components/number-field'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useStepper } from '@/components/ui/stepper'
import { formatDate } from '@/lib/dates'
import { createSpendingSchema } from '@/lib/form'
import { cn } from '@/lib/utils'
import { Category, Currency } from '@prisma/client'
import { CalendarIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react'
import { z } from 'zod'

interface ExpenseInfoFormProps {
  categories?: Category[]
  currencies?: Currency[]
  isLoading: boolean
  setFinalData: (data: any) => void
  form: any
}

export function GeneralInfoForm ({ categories, currencies, isLoading, setFinalData, form }: ExpenseInfoFormProps) {
  const { nextStep } = useStepper()

  const onSubmit = (values: z.infer<typeof createSpendingSchema>) => {
    const { name, amount, description, categoryId, currencyId, date } = values
    const payload = {
      name,
      amount,
      description,
      categoryId,
      currencyId,
      date
    }

    setFinalData(payload)
    nextStep()
  }

  return (
    <Card className='max-w-[526px] w-full'>
      <CardHeader>
        <CardTitle>Información del gasto</CardTitle>
        <CardDescription>Ingresa la información del gasto</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form} key={form.watch('amount') ? 0 : 1}>
          <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }: any) => (
                <FormItem className="grid gap-2 space-y-0">
                  <FormLabel>Nombre</FormLabel>
                  <FormControl className='mt-0'>
                    <Input
                      id='name'
                      type="text"
                      placeholder="Nombre del gasto"
                      className='mt-0'
                      {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            <FormField
              control={form.control}
              name="description"
              render={({ field }: any) => (
                <FormItem className="grid gap-2 space-y-0">
                  <FormLabel>Descripción</FormLabel>
                  <FormControl className='mt-0'>
                    <Input
                      id='description'
                      type="text"
                      placeholder="Descripción del gasto"
                      className='mt-0'
                      {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }: any) => (
                <FormItem className="grid gap-2 space-y-0">
                  <FormLabel>Categoría</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger disabled={isLoading ?? categories?.length === 0}>
                        <SelectValue placeholder={isLoading ? 'Cargando categorías...' : categories?.length === 0 ? 'No hay categorías disponibles' : 'Selecciona una categoría'} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories && categories?.length > 0 && (
                        categories.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            <div className="flex gap-4 flex-col md:flex-row">
              <FormField
                control={form.control}
                name="amount"
                render={({ field: { onChange, value } }) => (
                  <FormItem className="grid gap-2 space-y-0 w-full">
                    <FormLabel>Monto</FormLabel>
                    <FormControl className='mt-0'>
                    <NumberField
                      value={value}
                      onChange={onChange}
                      minValue={0}
                    >
                      <NumberFieldGroup>
                        <NumberFieldIncrement>
                          <ChevronUpIcon />
                        </NumberFieldIncrement>
                        <NumberFieldInput />
                        <NumberFieldDecrement>
                          <ChevronDownIcon />
                        </NumberFieldDecrement>
                      </NumberFieldGroup>
                    </NumberField>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              <FormField
                control={form.control}
                name="currencyId"
                render={({ field }: any) => (
                  <FormItem className="grid gap-2 space-y-0 w-full">
                    <FormLabel>Moneda</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger disabled={isLoading ?? currencies?.length === 0}>
                          <SelectValue placeholder={isLoading ? 'Cargando monedas...' : currencies?.length === 0 ? 'No hay monedas disponibles' : 'Selecciona una moneda'} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {currencies && currencies?.length > 0 && (
                          currencies.map(currency => (
                            <SelectItem key={currency.id} value={currency.id}>
                              {currency.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="date"
              render={({ field }: any) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel className='w-min'>Fecha</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value
                            ? (
                                formatDate(field.value)
                              )
                            : (
                              <span>Selecciona una fecha</span>
                              )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date() || date < new Date('2021-01-01')}
                        initialFocus />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )} />
            <Button type="submit" className="w-full" disabled={isLoading}>
              Siguiente
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
