'use client'

import { Button } from '@/components/ui/button'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useState } from 'react'
import { EditSpendingForm } from '../forms/edit-spending-form'

export function EditSpendingSheet ({ spendId, groupId, className, show }: { spendId: string, groupId: string, className?: string, show: boolean }) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [isOpen, setIsOpen] = useState(false)

  if (!show) return null

  if (isDesktop) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger className={className} asChild>
          <Button variant="outline">Editar</Button>
        </SheetTrigger>
        <SheetContent style={{ width: '550px' }} className='flex flex-col gap-4'>
          <SheetHeader>
            <SheetTitle>Editar gasto</SheetTitle>
            <SheetDescription>
              Aquí podrás editar el gasto que has creado.
            </SheetDescription>
          </SheetHeader>
          <div className='overflow-y-auto flex flex-col gap-4'>
            <EditSpendingForm spendId={spendId} groupId={groupId} callback={() => setIsOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger className={className} asChild>
        <Button variant="outline">Editar</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Editar gasto</DrawerTitle>
          <DrawerDescription>
            Aquí podrás editar el gasto que has creado.
          </DrawerDescription>
        </DrawerHeader>

        <div className='p-4 overflow-y-auto max-h-96'>
          <EditSpendingForm spendId={spendId} groupId={groupId} callback={() => setIsOpen(false)} />
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
