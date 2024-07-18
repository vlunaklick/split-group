'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { getAvailableCurrency } from '@/lib/data'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import useSWR from 'swr'

export const CurrencySetting = () => {
  const { data: currencies, isLoading } = useSWR('currencies-settings', getAvailableCurrency)
  const [selectedCurrency, setSelectedCurrency] = useState('')

  useEffect(() => {
    const currency = localStorage.getItem('currency')

    if (currency) {
      setSelectedCurrency(currency)
    } else {
      // DEFAULT CURRENCY ID
      setSelectedCurrency('clyqdcm9a0003zh07y62b10s0')
    }
  }, [])

  const handleSave = () => {
    if (!selectedCurrency) return

    localStorage.setItem('currency', selectedCurrency)
    toast.success('Moneda guardada correctamente', {
      duration: 1000
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Moneda por defecto</CardTitle>
        <CardDescription>
          Selecciona la moneda que deseas utilizar en la aplicación. Esta se utilizará para mostrar las estadísticas y resumenes financieros.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          {
            !isLoading
              ? (
                <Select value={selectedCurrency} onValueChange={setSelectedCurrency} defaultValue={selectedCurrency}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Moneda" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies?.map(currency => (
                      <SelectItem key={currency.value} value={currency.value}>
                        {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                )
              : <SelectSkeleton />
          }
        </form>
      </CardContent>
      <CardFooter className="border-t px-6 py-4 flex justify-end">
        <Button onClick={handleSave}>
          Guardar
        </Button>
      </CardFooter>
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
