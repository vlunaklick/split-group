'use client'

import { Button } from '@/components/ui/button'
import { SheetSection } from '@/components/ui/form-steps'
import { ResponsiveSheet } from '@/components/responsive-sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GenerateInviteForm } from '../forms/generate-invite-form'
import { InviteMemberForm } from '../forms/invite-member-form'
import { GeneratedInvitesList } from '../lists/generated-invites-list'
import { MembersInvitedList } from '../lists/members-invited-list'

export function InvitesSheet ({ className, groupId }: { className?: string, groupId: string }) {
  return (
    <ResponsiveSheet
      title="Invitaciones"
      description="Sumá gente por email o compartí un enlace."
      sheetWidth="32rem"
      trigger={
        <Button variant="outline" className={className}>
          Invitaciones
        </Button>
      }
    >
      <Tabs defaultValue="invite" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="invite">Por email</TabsTrigger>
          <TabsTrigger value="link">Enlace</TabsTrigger>
        </TabsList>
        <TabsContent value="invite" className="mt-5 space-y-6">
          <InviteMemberForm groupId={groupId} />
          <SheetSection title="Invitaciones enviadas">
            <MembersInvitedList groupId={groupId} embedded />
          </SheetSection>
        </TabsContent>
        <TabsContent value="link" className="mt-5 space-y-6">
          <GenerateInviteForm groupId={groupId} />
          <SheetSection title="Enlaces activos">
            <GeneratedInvitesList groupId={groupId} embedded />
          </SheetSection>
        </TabsContent>
      </Tabs>
    </ResponsiveSheet>
  )
}
