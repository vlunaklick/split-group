'use client'

import { Button } from '@/components/ui/button'
import { ResponsiveSheet } from '@/components/responsive-sheet'
import { IconSettings } from '@tabler/icons-react'
import { ChangeInfoGroupForm } from '../forms/change-info-form'
import { DeleteGroupForm } from '../forms/delete-group-form'

export function GroupConfigSheet ({ className, groupId }: { className?: string, groupId: string }) {
  return (
    <ResponsiveSheet
      title="Configuración del grupo"
      description="Edita la información o elimina el grupo."
      trigger={
        <Button variant="outline" size="icon" className={className}>
          <IconSettings className="h-4 w-4" />
          <span className="sr-only">Configuración</span>
        </Button>
      }
    >
      <ChangeInfoGroupForm groupId={groupId} />
      <DeleteGroupForm groupId={groupId} />
    </ResponsiveSheet>
  )
}
