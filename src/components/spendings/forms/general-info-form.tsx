'use client'

import { NumberField, NumberFieldDecrement, NumberFieldGroup, NumberFieldIncrement, NumberFieldInput } from '@/components/number-field'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useFormSteps } from '@/components/ui/form-steps'
import { formatDate } from '@/lib/dates'
import { spendingSchema } from '@/lib/form'
import { cn } from '@/lib/utils'
import { Category, Currency } from '@prisma/client'
import { CalendarIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { z } from 'zod'

interface ExpenseInfoFormProps {
  categories?: Category[]
  currencies?: Currency[]
  isLoading: boolean
  setFinalData: (data: any) => void
  form: any
}

export function GeneralInfoForm ({ categories, currencies, isLoading, setFinalData, form }: ExpenseInfoFormProps) {
  const { nextStep } = useFormSteps()
  const [showDescription, setShowDescription] = useState(false)
  const [showDate, setShowDate] = useState(false)
  const singleCurrency = currencies?.length === 1

  useEffect(() => {
    if (!currencies?.length || form.getValues('currencyId')) return
    const stored = typeof window !== 'undefined' ? localStorage.getItem('currency') : null
    const match = currencies.find((c) => c.name === stored) ?? currencies[0]
    if (match) form.setValue('currencyId', match.id, { shouldValidate: true })
  }, [currencies, form])

  useEffect(() => {
    if (!categories?.length || form.getValues('categoryId')) return
    const defaultCategory = categories.find((c) => c.name === 'Otros') ?? categories[0]
    if (defaultCategory) form.setValue('categoryId', defaultCategory.id, { shouldValidate: true })
  }, [categories, form])

  const onSubmit = (values: z.infer<typeof spendingSchema>) => {
    setFinalData({
      name: values.name,
      amount: values.amount,
      description: values.description,
      categoryId: values.categoryId,
      currencyId: values.currencyId,
      date: values.date
    })
    nextStep()
  }

  return (
    <Form {...form}>
      <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }: any) => (
            <FormItem className="grid gap-2 space-y-0">
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input
                  autoFocus
                  placeholder="Ej: Cena, supermercado, nafta…"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className={cn('flex gap-4 flex-col', !singleCurrency && 'md:flex-row')}>
          <FormField
            control={form.control}
            name="amount"
            render={({ field: { onChange, value } }) => (
              <FormItem className="grid gap-2 space-y-0 w-full">
                <FormLabel>Monto</FormLabel>
                <FormControl>
                  <NumberField value={value} onChange={onChange} minValue={0}>
                    <NumberFieldGroup>
                      <NumberFieldIncrement><ChevronUpIcon /></NumberFieldIncrement>
                      <NumberFieldInput />
                      <NumberFieldDecrement><ChevronDownIcon /></NumberFieldDecrement>
                    </NumberFieldGroup>
                  </NumberField>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {!singleCurrency && (
            <FormField
              control={form.control}
              name="currencyId"
              render={({ field }: any) => (
                <FormItem className="grid gap-2 space-y-0 w-full">
                  <FormLabel>Moneda</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger disabled={isLoading}>
                        <SelectValue placeholder="Moneda" />
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
          )}
        </div>

        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }: any) => (
            <FormItem className="grid gap-2 space-y-0">
              <FormLabel>Categoría</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger disabled={isLoading}>
                    <SelectValue placeholder="Elegí una categoría" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {showDate
          ? (
            <FormField
              control={form.control}
              name="date"
              render={({ field }: any) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel>Fecha</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                        >
                          {field.value ? formatDate(field.value) : 'Hoy'}
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
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            )
          : (
            <Button type="button" variant="link" className="h-auto justify-start p-0 text-muted-foreground" onClick={() => setShowDate(true)}>
              + Cambiar fecha
            </Button>
            )}

        <FormField
          control={form.control}
          name="description"
          render={({ field }: any) => (
            showDescription
              ? (
                <FormItem className="grid gap-2 space-y-0">
                  <FormLabel>Nota (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Detalle extra…" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
                )
              : (
                <Button type="button" variant="link" className="h-auto justify-start p-0 text-muted-foreground" onClick={() => setShowDescription(true)}>
                  + Nota
                </Button>
                )
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          Continuar
        </Button>
      </form>
    </Form>
  )
}
