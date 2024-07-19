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
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

// TODO: evaluar si puedo llevar esto a la db

export const AlertSettings = () => {
  const [mounted, setMounted] = useState(false)
  const [selectedSize, setSelectedSize] = useState('simple')

  useEffect(() => {
    setMounted(true)
    const size = localStorage.getItem('alert-size')
    setSelectedSize(size || 'simple')
  }, [])

  const handleSave = () => {
    if (!selectedSize) return

    localStorage.setItem('alert-size', selectedSize)
    toast.success('Tamaño de alertas guardado correctamente', {
      duration: 1000
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tamaño de alertas</CardTitle>
        <CardDescription>
          Personaliza el tamaño de las alertas que se muestran en la aplicación.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          {!mounted && (
            <SelectSkeleton />
          )}

          {mounted && (
            <Select value={selectedSize} onValueChange={setSelectedSize} defaultValue={selectedSize}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tamaño" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="simple">Simple</SelectItem>
                <SelectItem value="advanced">Avanzado</SelectItem>
              </SelectContent>
            </Select>
          )}
        </form>
      </CardContent>
      <CardFooter className="border-t px-6 py-4 flex justify-end">
        <Button onClick={handleSave} disabled={!mounted}>
          Guardar
        </Button>
      </CardFooter>
    </Card>
  )
}

export const SelectSkeleton = () => (
  <Select disabled>
    <SelectTrigger className="w-[180px]">
      <SelectValue placeholder="Tamaño" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="loading">
        Cargando...
      </SelectItem>
    </SelectContent>
  </Select>
)
