'use client'

import { Button } from '@/components/ui/button'
import { ResponsiveSheet } from '@/components/responsive-sheet'
import { ReactNode, useState } from 'react'
import { CreateSpendingForm } from '../forms/create-spending-form'
import { SpendingPrefill } from '../forms/spending-prefill'

export function CreateSpendingSheet ({
  groupId,
  className,
  variant = 'outline',
  label = 'Crear gasto',
  icon,
  prefill,
  title = 'Crear gasto',
  description = 'Nombre, monto y quién pagó.',
  open: openProp,
  onOpenChange: onOpenChangeProp,
  hideTrigger = false
}: {
  groupId: string
  className?: string
  variant?: 'outline' | 'default'
  label?: string
  icon?: ReactNode
  prefill?: SpendingPrefill
  title?: string
  description?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  hideTrigger?: boolean
}) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [formKey, setFormKey] = useState(0)
  const isOpen = openProp ?? internalOpen

  const handleOpenChange = (open: boolean) => {
    if (onOpenChangeProp) {
      onOpenChangeProp(open)
    } else {
      setInternalOpen(open)
    }
    if (!open) setFormKey((k) => k + 1)
  }

  const handleSuccess = () => {
    handleOpenChange(false)
    setFormKey((k) => k + 1)
  }

  return (
    <ResponsiveSheet
      open={isOpen}
      onOpenChange={handleOpenChange}
      title={title}
      description={description}
      trigger={
        hideTrigger
          ? <span className="sr-only" aria-hidden />
          : (
            <Button variant={variant} className={className} aria-label={label || title}>
              {icon ?? label}
            </Button>
            )
      }
    >
      <CreateSpendingForm
        key={`${formKey}-${prefill?.name ?? 'new'}`}
        groupId={groupId}
        onSuccess={handleSuccess}
        prefill={prefill}
      />
    </ResponsiveSheet>
  )
}
