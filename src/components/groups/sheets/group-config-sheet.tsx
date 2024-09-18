'use client'

import { Button } from '@/components/ui/button'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useMediaQuery } from '@/hooks/use-media-query'
import { IconSettings } from '@tabler/icons-react'
import { ChangeInfoGroupForm } from '../forms/change-info-form'
import { DeleteGroupForm } from '../forms/delete-group-form'

export function GroupConfigSheet ({ className, groupId }: { className?: string, groupId: string }) {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return (
      <Sheet>
        <SheetTrigger className={className} asChild>
          <Button variant="outline" size='icon'>
            <IconSettings />
          </Button>
        </SheetTrigger>
        <SheetContent style={{ width: '550px' }} className='flex flex-col gap-4'>
          <SheetHeader>
            <SheetTitle>Configuración</SheetTitle>
            <SheetDescription>
              Aquí podrás ver y modificar la configuración del grupo.
            </SheetDescription>
          </SheetHeader>

          <div className='overflow-y-auto flex flex-col gap-4'>
            <ChangeInfoGroupForm groupId={groupId} />
            <DeleteGroupForm groupId={groupId} />
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Drawer>
      <DrawerTrigger className={className} asChild>
        <Button variant="outline" size='icon'>
          <IconSettings />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Configuración</DrawerTitle>
          <DrawerDescription>
            Aquí podrás ver y modificar la configuración del grupo.
          </DrawerDescription>
        </DrawerHeader>

        <div className='p-4 overflow-y-auto max-h-96 flex flex-col gap-4'>
          <ChangeInfoGroupForm groupId={groupId} />
          <DeleteGroupForm groupId={groupId} />
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
