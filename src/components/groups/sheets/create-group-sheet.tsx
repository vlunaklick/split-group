'use client'

import { Button } from '@/components/ui/button'
import { ResponsiveSheet } from '@/components/responsive-sheet'
import { IconCirclePlus } from '@tabler/icons-react'
import { useState } from 'react'
import { CreateGroupFrom } from '../forms/create-group-form'

export function CreateGroupSheet ({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <ResponsiveSheet
      open={isOpen}
      onOpenChange={setIsOpen}
      title="Crear grupo"
      description="Elige un nombre y empieza a dividir gastos con tu gente."
      trigger={
        <Button variant="outline" className={className}>
          <IconCirclePlus className="h-4 w-4" />
          <span className="group-data-[collapsible=icon]:hidden">Crear grupo</span>
        </Button>
      }
    >
      <CreateGroupFrom callback={() => setIsOpen(false)} />
    </ResponsiveSheet>
  )
}
