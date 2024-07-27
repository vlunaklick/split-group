'use client'

import { createSpending, getCategories } from '../actions'
import { getAvailableCurrency, getGroupParticipants } from '@/lib/data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import useSWR from 'swr'
import { createSpendingSchema } from '@/lib/form'
import { useState } from 'react'
import { Input, inputVariants } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Category, Currency, User } from '@prisma/client'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { formatDate } from '@/lib/dates'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import CurrencyInput from 'react-currency-input-field'

export const CreateSpending = ({ groupId, userId }: { groupId: string; userId: string }) => {
  const [debters, setDebters] = useState<{
    userId: string
    amount: number
  }[]>([])
  const [payers, setPayers] = useState<{
    userId: string
    amount: number
  }[]>([])

  const { data: categories, isLoading: isLoadingCategories } = useSWR(['categories', userId], getCategories)
  const { data: currencies, isLoading: isLoadingCurrencies } = useSWR('currencies', getAvailableCurrency)
  const { data: participants, isLoading: isLoadingParticipants } = useSWR(['groupParticipants', groupId], async () => {
    return await getGroupParticipants(groupId)
  })

  const handleSelectPayer = (value: string) => {
    if (!payers.find((payer: any) => payer.userId === value)) {
      setPayers((prev: any) => [...prev, {
        userId: value,
        amount: 0
      }])

      if (debters.find((debter: any) => debter.userId === value)) {
        const referencedArray = [...debters]
        const itemToBeRemoved = referencedArray.find((debter: any) => debter.userId === value) as any
        const indexOfItemToBeRemoved = referencedArray.indexOf(itemToBeRemoved)
        referencedArray.splice(indexOfItemToBeRemoved, 1)
        setDebters(referencedArray)
      }
    } else {
      const referencedArray = [...payers]
      const itemToBeRemoved = referencedArray.find((payer: any) => payer.userId === value) as any
      const indexOfItemToBeRemoved = referencedArray.indexOf(itemToBeRemoved)
      referencedArray.splice(indexOfItemToBeRemoved, 1)
      setPayers(referencedArray)
    }
  }

  const handleSelectDebter = (value: string) => {
    if (!debters.find((debter: any) => debter.userId === value)) {
      setDebters((prev: any) => [...prev, {
        userId: value,
        amount: 0
      }])
    } else {
      const referencedArray = [...debters]
      const itemToBeRemoved = referencedArray.find((debter: any) => debter.userId === value) as any
      const indexOfItemToBeRemoved = referencedArray.indexOf(itemToBeRemoved)
      referencedArray.splice(indexOfItemToBeRemoved, 1)
      setDebters(referencedArray)
    }
  }

  const form = useForm<z.infer<typeof createSpendingSchema>>({
    resolver: zodResolver(createSpendingSchema),
    defaultValues: {
      name: '',
      amount: 0,
      description: '',
      categoryId: '',
      currencyId: ''
    }
  })

  const onSubmit = async (values: z.infer<typeof createSpendingSchema>) => {
    const { name, amount, description, categoryId, currencyId, date } = values
    const payload = {
      name,
      amount,
      description,
      categoryId,
      currencyId,
      date,
      debters,
      payers
    }

    console.log(payload)

    try {
      // await createSpending({
      //   groupId,
      //   spending: payload
      // })
      toast.success('Spending created')
      form.reset()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <InfoCard form={form} onSubmit={onSubmit} categories={categories} currencies={currencies} isLoading={isLoadingCategories || isLoadingCurrencies} />
      <Payers payers={payers} setPayers={setPayers} participants={participants} isLoading={isLoadingParticipants} totalAmount={form.watch('amount') || 0} handleSelectPayer={handleSelectPayer} />
      <Debters debters={debters} setDebters={setDebters} participants={participants} isLoading={isLoadingParticipants} totalAmount={form.watch('amount') || 0} payers={payers} handleSelectDebter={handleSelectDebter} />

    </>
  )
}

const InfoCard = ({ form, onSubmit, categories, currencies, isLoading } : { form: any; onSubmit: any; categories?: Category[]; currencies?: Currency[]; isLoading: boolean }) => {
  return (
    <Card className='max-w-[526px] w-full'>
      <CardHeader>
        <CardTitle>Información del gasto</CardTitle>
        <CardDescription>Ingresa la información del gasto</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
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
                      <Input
                        id='amount'
                        type="number"
                        placeholder="0.00"
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
                            !field.value && 'text-zinc-400'
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
              Crear gasto
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

const Debters = ({ debters, setDebters, participants, isLoading, totalAmount, payers, handleSelectDebter }: { debters: any; setDebters: any; participants?: any[]; isLoading: boolean; totalAmount: number; payers: any; handleSelectDebter: any }) => {
  const [mode, setMode] = useState<'equal' | 'custom'>('equal')

  const handleSelectChange = (value: string) => {
    handleSelectDebter(value)
  }

  const isOptionSelected = (value: string): boolean => {
    return !!debters.find((debter: any) => debter.userId === value)
  }

  const handleAmountChange = (value: number, index: number) => {
    if (value < 0) {
      return
    }

    const totalDebtersAmount = debters.reduce((acc: number, debter: any) => acc + debter.amount, 0)

    if (totalDebtersAmount > totalAmount) {
      return
    }

    setDebters((prev: any) => {
      prev[index].amount = value
      return [...prev]
    })
  }

  return (
    <Card className='max-w-[526px] w-full'>
      <CardHeader>
        <CardTitle>Deudores</CardTitle>
        <CardDescription>Selecciona los deudores</CardDescription>
      </CardHeader>
      <CardContent>
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
          <Select onValueChange={(value: string) => setMode(value as 'equal' | 'custom')} defaultValue={mode}>
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

        {debters.length > 0 && mode === 'equal' && (
          <div className="grid gap-4 mt-4">
            {debters.map((debter: any, index: number) => (
              <div key={index} className="flex items-center w-full">
                <div className="gap-4 flex items-center border-l border-y border-zinc-800 p-2 rounded-l-md w-3/4">
                  <p>@{participants?.find((participant: User) => participant.id === debter.userId)?.username}</p>
                </div>
                <div className="gap-4 flex border border-zinc-800 p-2 rounded-r-md w-1/4 justify-end">
                  <p>${totalAmount ? (totalAmount / debters.length).toFixed(2) : 0}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

const Payers = ({ payers, setPayers, participants, isLoading, totalAmount, handleSelectPayer }: { payers: any; setPayers: any; participants?: any[]; isLoading: boolean; totalAmount: number; handleSelectPayer: any }) => {
  const handleSelectChange = (value: string) => {
    handleSelectPayer(value)
  }

  const isOptionSelected = (value: string): boolean => {
    return !!payers.find((payer: any) => payer.userId === value)
  }

  const handleAmountChange = (value: number, name: string) => {
    if (value < 0) {
      return
    }

    const totalPayersAmount = payers.reduce((acc: number, payer: any) => acc + payer.amount, 0)

    if (totalPayersAmount > totalAmount) {
      return
    }

    setPayers((prev: any) => {
      prev.find((payer: any) => payer.userId === name).amount = value
      return [...prev]
    })
  }

  return (
    <Card className='max-w-[526px] w-full'>
      <CardHeader>
        <CardTitle>Contribuyentes</CardTitle>
        <CardDescription>Selecciona los contribuyentes</CardDescription>
      </CardHeader>
      <CardContent>
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
            payers.map((payer: any, index: number) => (
              <div key={index} className="gap-4 flex items-center">
                <Label>@{participants?.find((participant: User) => participant.id === payer.userId)?.username}</Label>

              </div>
            ))
          )}
        </div>

      </CardContent>
    </Card>
  )
}
