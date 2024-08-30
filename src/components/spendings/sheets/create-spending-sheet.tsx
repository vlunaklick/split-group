'use client'

import { Button } from '@/components/ui/button'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useState } from 'react'
import { CreateSpendingForm } from '../forms/create-spending-form'

export function CreateSpendingSheet ({ groupId, className }: { groupId: string, className?: string }) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [isOpen, setIsOpen] = useState(false)

  if (isDesktop) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger className={className} asChild>
          <Button variant="outline">Crear gasto</Button>
        </SheetTrigger>
        <SheetContent style={{ width: '550px' }}>
          <SheetHeader>
            <SheetTitle>Crear gasto</SheetTitle>
            <SheetDescription>
              Aquí podrás crear un nuevo gasto.
            </SheetDescription>

            <CreateSpendingForm groupId={groupId} />
          </SheetHeader>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger className={className} asChild>
        <Button variant="outline">Crear gasto</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Crear gasto</DrawerTitle>
          <DrawerDescription>
            Aquí podrás crear un nuevo gasto.
          </DrawerDescription>
        </DrawerHeader>

        <div className='p-4 overflow-y-auto max-h-96'>
          <CreateSpendingForm groupId={groupId} />
        </div>

        <DrawerFooter>
          <DrawerClose>
            <Button variant="outline" className='w-full'>Cancelar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
