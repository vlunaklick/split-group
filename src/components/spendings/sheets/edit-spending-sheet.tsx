'use client'

import { Button } from '@/components/ui/button'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useState } from 'react'
import { EditSpendingForm } from '../forms/edit-spending-form'

export function EditSpendingSheet ({ spendId, userId, groupId, className }: { spendId: string, userId: string, groupId: string, className?: string }) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [isOpen, setIsOpen] = useState(false)

  if (isDesktop) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger className={className} asChild>
          <Button variant="outline">Editar</Button>
        </SheetTrigger>
        <SheetContent style={{ width: '550px' }}>
          <SheetHeader>
            <SheetTitle>Editar gasto</SheetTitle>
            <SheetDescription>
              Aquí podrás editar el gasto que has creado.
            </SheetDescription>

            <EditSpendingForm spendId={spendId} userId={userId} groupId={groupId} setIsOpen={setIsOpen} />
          </SheetHeader>
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
          <EditSpendingForm spendId={spendId} userId={userId} groupId={groupId} setIsOpen={setIsOpen} />
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
