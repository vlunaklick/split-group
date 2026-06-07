'use client'

import { Button } from '@/components/ui/button'
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
      description="Invita por email o comparte un enlace."
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
        <TabsContent value="invite" className="mt-4">
          <InviteMemberForm groupId={groupId} />
        </TabsContent>
        <TabsContent value="link" className="mt-4">
          <GenerateInviteForm groupId={groupId} />
        </TabsContent>
      </Tabs>

      <MembersInvitedList groupId={groupId} />
      <GeneratedInvitesList groupId={groupId} />
    </ResponsiveSheet>
  )
}
