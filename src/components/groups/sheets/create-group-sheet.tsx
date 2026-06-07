'use client'

import { Button } from '@/components/ui/button'
import { ResponsiveSheet } from '@/components/responsive-sheet'
import { SidebarMenuButton } from '@/components/ui/sidebar'
import { IconCirclePlus } from '@tabler/icons-react'
import { useState } from 'react'
import { CreateGroupForm } from '../forms/create-group-form'

export function CreateGroupSheet ({
  className,
  triggerVariant = 'ghost',
  triggerLabel = 'Crear grupo',
  sidebarTrigger = false,
  open: openProp,
  onOpenChange: onOpenChangeProp,
  hideTrigger = false
}: {
  className?: string
  triggerVariant?: 'ghost' | 'outline' | 'default'
  triggerLabel?: string
  sidebarTrigger?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  hideTrigger?: boolean
}) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isOpen = openProp ?? internalOpen
  const setIsOpen = onOpenChangeProp ?? setInternalOpen

  const trigger = hideTrigger
    ? <span className="sr-only" aria-hidden />
    : sidebarTrigger
      ? (
        <SidebarMenuButton title={triggerLabel}>
          <span className="flex h-4 w-4 shrink-0 items-center justify-center">
            <IconCirclePlus className="h-4 w-4" />
          </span>
          <span className="truncate">{triggerLabel}</span>
        </SidebarMenuButton>
        )
      : (
        <Button variant={triggerVariant} className={className}>
          <IconCirclePlus className="h-4 w-4" />
          <span>{triggerLabel}</span>
        </Button>
        )

  return (
    <ResponsiveSheet
      open={isOpen}
      onOpenChange={setIsOpen}
      title="Crear grupo"
      description="Elige un nombre y empieza a dividir gastos con tu gente."
      trigger={trigger}
    >
      <CreateGroupForm callback={() => setIsOpen(false)} />
    </ResponsiveSheet>
  )
}
