'use client'

import { Button } from '@/components/ui/button'
import { SheetSection } from '@/components/ui/form-steps'
import { ResponsiveSheet } from '@/components/responsive-sheet'
import { IconSettings } from '@tabler/icons-react'
import { ChangeInfoGroupForm } from '../forms/change-info-form'
import { DeleteGroupForm } from '../forms/delete-group-form'

export function GroupConfigSheet ({ className, groupId }: { className?: string, groupId: string }) {
  return (
    <ResponsiveSheet
      title="Configuración"
      description="Nombre, ícono o eliminar el grupo."
      trigger={
        <Button variant="outline" size="icon" className={className}>
          <IconSettings className="h-4 w-4" />
          <span className="sr-only">Configuración</span>
        </Button>
      }
    >
      <SheetSection title="Información" className="border-0 pt-0">
        <ChangeInfoGroupForm groupId={groupId} />
      </SheetSection>
      <SheetSection title="Zona de peligro">
        <DeleteGroupForm groupId={groupId} />
      </SheetSection>
    </ResponsiveSheet>
  )
}
