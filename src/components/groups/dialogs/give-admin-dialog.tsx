'use client'

import { ResponsiveSheet } from '@/components/responsive-sheet'
import { GiveAdminForm } from '../forms/give-admin-form'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function GiveAdminDialog ({ groupId }: { groupId: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <ResponsiveSheet
      open={isOpen}
      onOpenChange={setIsOpen}
      title="Agregar administrador"
      description="Elegí un miembro para darle permisos de admin."
      sheetWidth="24rem"
      showMobileCancel={false}
      trigger={
        <Button variant="outline" size="sm">
          Agregar admin
        </Button>
      }
    >
      <GiveAdminForm groupId={groupId} />
    </ResponsiveSheet>
  )
}
