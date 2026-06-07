'use client'

import { Button } from '@/components/ui/button'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useMediaQuery } from '@/hooks/use-media-query'
import { IconCirclePlus, IconLayoutDashboard } from '@tabler/icons-react'
import { CreateGroupFrom } from '../forms/create-group-form'
import { useState } from 'react'

export function CreateGroupSheet ({ className }: { className?: string }) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [isOpen, setIsOpen] = useState(false)

  if (isDesktop) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger className={className} asChild>
          <Button variant="outline">
            <IconCirclePlus className="h-4 w-4" />
            <span>Crear grupo</span>
          </Button>
        </SheetTrigger>
        <SheetContent style={{ width: '550px' }} className='flex flex-col gap-4'>
          <SheetHeader>
            <SheetTitle>Crear grupo</SheetTitle>
            <SheetDescription>
              Aquí podrás crear un nuevo grupo.
            </SheetDescription>
          </SheetHeader>

          <div className='overflow-y-auto flex flex-col gap-4'>
            <CreateGroupFrom callback={() => setIsOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger className={className} asChild>
        <Button variant="outline" size='icon'>
          <IconCirclePlus className="h-4 w-4" />
          <span className="sr-only">Crear grupo</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            Crear grupo
          </DrawerTitle>
          <DrawerDescription>
            Aquí podrás crear un nuevo grupo.
          </DrawerDescription>
        </DrawerHeader>

        <div className='p-4 overflow-y-auto max-h-96 flex flex-col gap-4'>
          <CreateGroupFrom callback={() => setIsOpen(false)} />
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
