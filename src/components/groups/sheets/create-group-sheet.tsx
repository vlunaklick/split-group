'use client'

import { Button } from '@/components/ui/button'
import { ResponsiveSheet } from '@/components/responsive-sheet'
import { IconCirclePlus } from '@tabler/icons-react'
import { useState } from 'react'
import { CreateGroupForm } from '../forms/create-group-form'

export function CreateGroupSheet ({
  className,
  open: openProp,
  onOpenChange: onOpenChangeProp,
  hideTrigger = false
}: {
  className?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  hideTrigger?: boolean
}) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isOpen = openProp ?? internalOpen
  const setIsOpen = onOpenChangeProp ?? setInternalOpen

  return (
    <ResponsiveSheet
      open={isOpen}
      onOpenChange={setIsOpen}
      title="Crear grupo"
      description="Elige un nombre y empieza a dividir gastos con tu gente."
      trigger={
        hideTrigger
          ? <span className="sr-only" aria-hidden />
          : (
            <Button variant="ghost" className={className}>
              <IconCirclePlus className="h-4 w-4" />
              <span className="group-data-[collapsible=icon]:hidden">Crear grupo</span>
            </Button>
            )
      }
    >
      <CreateGroupForm callback={() => setIsOpen(false)} />
    </ResponsiveSheet>
  )
}
