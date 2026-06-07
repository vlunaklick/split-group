'use client'

import { Button } from '@/components/ui/button'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useState } from 'react'
import { CreateSpendingForm } from '../forms/create-spending-form'

export function CreateSpendingSheet ({
  groupId,
  className,
  variant = 'outline'
}: {
  groupId: string
  className?: string
  variant?: 'outline' | 'default'
}) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [isOpen, setIsOpen] = useState(false)
  const [formKey, setFormKey] = useState(0)

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setFormKey((k) => k + 1)
    }
  }

  const handleSuccess = () => {
    setIsOpen(false)
    setFormKey((k) => k + 1)
  }

  const form = <CreateSpendingForm key={formKey} groupId={groupId} onSuccess={handleSuccess} />

  if (isDesktop) {
    return (
      <Sheet open={isOpen} onOpenChange={handleOpenChange}>
        <SheetTrigger className={className} asChild>
          <Button variant={variant}>Crear gasto</Button>
        </SheetTrigger>
        <SheetContent style={{ width: '550px' }} className='flex flex-col gap-4'>
          <SheetHeader>
            <SheetTitle>Crear gasto</SheetTitle>
            <SheetDescription>
              Detalles, quién pagó y quién debe — en tres pasos.
            </SheetDescription>
          </SheetHeader>
          <div className='overflow-y-auto flex flex-col gap-4 flex-1'>
            {form}
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange}>
      <DrawerTrigger className={className} asChild>
        <Button variant={variant}>Crear gasto</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Crear gasto</DrawerTitle>
          <DrawerDescription>
            Detalles, quién pagó y quién debe — en tres pasos.
          </DrawerDescription>
        </DrawerHeader>

        <div className='px-4 overflow-y-auto max-h-[85dvh]'>
          {form}
        </div>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline" className='w-full'>Cancelar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
