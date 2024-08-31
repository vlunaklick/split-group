'use client'

import { Button } from '@/components/ui/button'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useMediaQuery } from '@/hooks/use-media-query'
import { GenerateInviteForm } from '../forms/generate-invite-form'
import { InviteMemberForm } from '../forms/invite-member-form'
import { GeneratedInvitesList } from '../lists/generated-invites-list'
import { MembersInvitedList } from '../lists/members-invited-list'

export function InvitesSheet ({ className, groupId }: { className?: string, groupId: string }) {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return (
      <Sheet>
        <SheetTrigger className={className} asChild>
          <Button variant="outline">Invitaciones</Button>
        </SheetTrigger>
        <SheetContent style={{ width: '550px' }} className='flex flex-col gap-4'>
          <SheetHeader>
            <SheetTitle>Invitaciones</SheetTitle>
            <SheetDescription>
              Aquí podrás ver las invitaciones que has enviado a otras personas.
            </SheetDescription>
          </SheetHeader>

          <div className='overflow-y-auto flex flex-col gap-4'>
            <Tabs defaultValue="invite" className="w-full mt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="invite">Invitar</TabsTrigger>
                <TabsTrigger value="link">Generar enlace</TabsTrigger>
              </TabsList>
              <TabsContent value="invite" className="mt-4">
                <InviteMemberForm groupId={groupId} />
              </TabsContent>
              <TabsContent value="link" className="mt-4">
                <GenerateInviteForm groupId={groupId} />
              </TabsContent>
            </Tabs>

            <MembersInvitedList groupId={groupId} />
            <GeneratedInvitesList groupId={groupId} />
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Drawer>
      <DrawerTrigger className={className} asChild>
        <Button variant="outline">Invitaciones</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Invitaciones</DrawerTitle>
          <DrawerDescription>
            Aquí podrás ver las invitaciones que has enviado a otras personas.
          </DrawerDescription>
        </DrawerHeader>

        <div className='p-4 overflow-y-auto max-h-96 flex flex-col gap-4'>
          <Tabs defaultValue="invite" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="invite">Invitar</TabsTrigger>
              <TabsTrigger value="link">Generar enlace</TabsTrigger>
            </TabsList>
            <TabsContent value="invite" className="mt-4">
              <InviteMemberForm groupId={groupId} />
            </TabsContent>
            <TabsContent value="link" className="mt-4">
              <GenerateInviteForm groupId={groupId} />
            </TabsContent>
          </Tabs>

          <MembersInvitedList groupId={groupId} />
          <GeneratedInvitesList groupId={groupId} />
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
