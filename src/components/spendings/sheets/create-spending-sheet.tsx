'use client'

import { Button } from '@/components/ui/button'
import { ResponsiveSheet } from '@/components/responsive-sheet'
import { useState } from 'react'
import { CreateSpendingForm } from '../forms/create-spending-form'

export function CreateSpendingSheet ({
  groupId,
  className,
  variant = 'outline'
}: {
  groupId: string
  className?: string
  variant?: 'outline' | 'default'
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [formKey, setFormKey] = useState(0)

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) setFormKey((k) => k + 1)
  }

  const handleSuccess = () => {
    setIsOpen(false)
    setFormKey((k) => k + 1)
  }

  return (
    <ResponsiveSheet
      open={isOpen}
      onOpenChange={handleOpenChange}
      title="Crear gasto"
      description="Detalles, quién pagó y quién debe — en tres pasos."
      trigger={
        <Button variant={variant} className={className}>
          Crear gasto
        </Button>
      }
    >
      <CreateSpendingForm key={formKey} groupId={groupId} onSuccess={handleSuccess} />
    </ResponsiveSheet>
  )
}
