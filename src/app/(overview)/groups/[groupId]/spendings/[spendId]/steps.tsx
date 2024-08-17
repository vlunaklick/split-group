'use client'

import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input, inputStyle } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useStepper } from '@/components/ui/stepper'
import { formatDate } from '@/lib/dates'
import { updateSpendingSchema } from '@/lib/form'
import { cn } from '@/lib/utils'
import { Category, Currency, User } from '@prisma/client'
import { CalendarIcon } from '@radix-ui/react-icons'
import { useState } from 'react'
import CurrencyInput from 'react-currency-input-field'
import { z } from 'zod'
import { DistributionMode, DistributionModeType } from '../types'

export const PayersForm = ({ participants, isLoading, totalAmount, setFinalData }: { participants?: any[]; isLoading: boolean; totalAmount: number; setFinalData: (data: any) => void }) => {
  const { nextStep, prevStep } = useStepper()
  const [error, setError] = useState<string | null>(null)
  const [payers, setPayers] = useState<{
    userId: string
    amount: number
  }[]>([])

  const handleSelectChange = (value: string) => {
    if (payers.find((payer: any) => payer.userId === value)) {
      setPayers((prev: any) => {
        return prev.filter((payer: any) => payer.userId !== value)
      })
    } else {
      setPayers((prev: any) => {
        return [...prev, { userId: value, amount: 0 }]
      })
    }
  }

  const isOptionSelected = (value: string): boolean => {
    return !!payers.find((payer: any) => payer.userId === value)
  }

  const handleAmountChange = (value: string, userId: string) => {
    setPayers((prev: any) => {
      return prev.map((payer: any) => {
        if (payer.userId === userId) {
          return { userId, amount: parseFloat(value.replace('$', '')) }
        }
        return payer
      })
    })
  }

  const handleNextStep = () => {
    setError(null)

    if (payers.length === 0) {
      setError('Debes seleccionar al menos un contribuyente')
      return
    }

    const totalPayersAmount = payers.reduce((acc: number, payer: any) => acc + payer.amount, 0)

    if (totalPayersAmount !== totalAmount) {
      setError('La suma de los montos de los contribuyentes debe ser igual al monto total')
      return
    }

    setFinalData((prev: any) => {
      return {
        ...prev,
        payers
      }
    })

    nextStep()
  }

  const handlePrevStep = () => {
    prevStep()
  }

  return (
    <>
      <p className="text-gray-500 mb-4">Monto total: <Badge variant="default">{totalAmount}</Badge></p>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex gap-2 w-full" disabled={isLoading}>
            Seleccionar contribuyentes
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full max-w-[320px]" onCloseAutoFocus={(e) => e.preventDefault()}>
          <DropdownMenuLabel>Participantes</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {participants?.map((participant: User, index: number) => {
            return (
              <DropdownMenuCheckboxItem
                onSelect={(e) => e.preventDefault()}
                key={index}
                checked={isOptionSelected(participant.id)}
                onCheckedChange={() => handleSelectChange(participant.id)}
              >
                @{participant.username} - {participant.email}
              </DropdownMenuCheckboxItem>
            )
          }
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator className="my-4" />

      <div className="grid gap-4">
        {payers?.length === 0 && (
          <p>No hay contribuyentes seleccionados</p>
        )}

        {payers?.length > 0 && (
          <>
            {payers.map((payer: any, index: number) => (
              <div key={index} className="gap-4 flex items-center">
                <Label>@{participants?.find((participant: User) => participant.id === payer.userId)?.username}</Label>
                <CurrencyInput
                  name={payer.userId}
                  placeholder="$0.00"
                  className={inputStyle}
                  decimalsLimit={2}
                  onChange={(e) => handleAmountChange(e.target.value, payer.userId)}
                />
              </div>
            ))}

            {error && (
              <p className="text-red-500">{error}</p>
            )}

            <Button variant="default" className="w-full" onClick={handleNextStep}>Continuar</Button>
          </>
        )}

      </div>
      <Button variant="ghost" className="w-full mt-4" onClick={handlePrevStep}>Atrás</Button>
    </>
  )
}

export const ExpeseInfoForm = ({ categories, currencies, isLoading, setFinalData, form }: { categories?: Category[]; currencies?: Currency[]; isLoading: boolean; setFinalData: (data: any) => void; form: any }) => {
  const { nextStep } = useStepper()

  const onSubmit = (values: z.infer<typeof updateSpendingSchema>) => {
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
    <>
      <Form {...form}>
        <form className="grid gap-4 p-2 w-full" onSubmit={form.handleSubmit(onSubmit)} key={form.watch('name') ? 0 : 1}>
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
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
            )}
          />
          <div className="flex gap-4 flex-col md:flex-row">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }: any) => (
                <FormItem className="grid gap-2 space-y-0 w-full">
                  <FormLabel>Monto</FormLabel>
                  <FormControl className='mt-0'>
                    <CurrencyInput
                      name='amount'
                      placeholder="$0.00"
                      decimalsLimit={2}
                      className={inputStyle}
                      onChange={(value) => field.onChange(value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                <FormLabel>Fecha</FormLabel>
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
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date('2021-01-01')
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            Siguiente
          </Button>
        </form>
      </Form>
    </>
  )
}

export const DebtersForm = ({ participants, isLoading, totalAmount, payers, setFinalData, mode, setMode }: { participants?: any[]; isLoading: boolean; totalAmount: number; payers: any; setFinalData: (data: any) => void, mode: DistributionModeType, setMode: (mode: DistributionModeType) => void }) => {
  const { nextStep, prevStep } = useStepper()
  const [error, setError] = useState<string | null>(null)
  const [debters, setDebters] = useState<{
    userId: string
    amount: number
  }[]>([])

  const handleSelectChange = (value: string) => {
    if (debters.find((debter: any) => debter.userId === value)) {
      setDebters((prev: any) => {
        return prev.filter((debter: any) => debter.userId !== value)
      })
    } else {
      setDebters((prev: any) => {
        return [...prev, { userId: value, amount: 0 }]
      })
    }
  }

  const isOptionSelected = (value: string): boolean => {
    return !!debters.find((debter: any) => debter.userId === value)
  }

  const handleNextStep = () => {
    if (debters.length === 0) {
      setError('Debes seleccionar al menos un contribuyente')
      return
    }

    if (!(mode === DistributionMode.EQUAL)) {
      const totalDebtersAmount = debters.reduce((acc: number, debter: any) => acc + debter.amount, 0)

      if (totalDebtersAmount !== totalAmount) {
        setError('La suma de los montos de los contribuyentes debe ser igual al monto total')
        return
      }
    }

    setFinalData((prev: any) => {
      return {
        ...prev,
        debters: debters.map((debter: any) => {
          return {
            userId: debter.userId,
            amount: debter.amount
          }
        })
      }
    })

    nextStep()
  }

  const handlePrevStep = () => {
    prevStep()
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex gap-2 w-full" disabled={isLoading}>
            Seleccionar deudores
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full max-w-[320px]" onCloseAutoFocus={(e) => e.preventDefault()}>
          <DropdownMenuLabel>Participantes</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {participants?.map((participant: User, index: number) => {
            if (payers?.find((payer: any) => payer.userId === participant.id)) {
              return null
            }

            return (
              <DropdownMenuCheckboxItem
                onSelect={(e) => e.preventDefault()}
                key={index}
                checked={isOptionSelected(participant.id)}
                onCheckedChange={() => handleSelectChange(participant.id)}
              >
                @{participant.username} - {participant.email}
              </DropdownMenuCheckboxItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator className="my-4" />

      <div className="flex gap-4 items-center">
        <Label>Modo de distribución</Label>
        <Select onValueChange={(value: string) => setMode(value as DistributionModeType)} defaultValue={mode}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="equal">Igualitaria</SelectItem>
            {/* <SelectItem value="custom">Por monto</SelectItem> */}
          </SelectContent>
        </Select>
      </div>
      {debters.length === 0 && (
        <p className="mt-4">No hay deudores seleccionados</p>
      )}

      {debters.length > 0 && mode === DistributionMode.EQUAL && (
        <div className="grid gap-4 mt-4">
          {debters.map((debter: any, index: number) => (
            <div key={index} className="flex gap-4 items-center p-2">
              <div className={cn(buttonVariants({ variant: 'secondary', size: 'icon' }), 'rounded-full')}>
                {participants?.find((participant: User) => participant.id === debter.userId)?.username[0]}
              </div>

              <div className="flex flex-col gap-1">
                <span>{participants?.find((participant: User) => participant.id === debter.userId)?.username}</span>
                <span className="text-sm text-gray-500">
                  {participants?.find((participant: User) => participant.id === debter.userId)?.email}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {debters.length > 0 && (
        <>
          {error && (
            <p className="text-red-500 mt-4">{error}</p>
          )}

          <Button onClick={handleNextStep} className="mt-4 w-full" variant="default">
            Continuar
          </Button>
        </>
      )}

      <Button onClick={handlePrevStep} className="mt-4 w-full" variant="outline">
        Volver
      </Button>
    </>
  )
}
