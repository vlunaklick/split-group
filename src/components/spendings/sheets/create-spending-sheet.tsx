'use client'

import { Button } from '@/components/ui/button'
import { ResponsiveSheet } from '@/components/responsive-sheet'
import { ReactNode, useState } from 'react'
import { CreateSpendingForm } from '../forms/create-spending-form'

export function CreateSpendingSheet ({
  groupId,
  className,
  variant = 'outline',
  label = 'Crear gasto',
  icon
}: {
  groupId: string
  className?: string
  variant?: 'outline' | 'default'
  label?: string
  icon?: ReactNode
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
      description="Nombre, monto y quién pagó."
      trigger={
        <Button variant={variant} className={className} aria-label={label || 'Crear gasto'}>
          {icon ?? label}
        </Button>
      }
    >
      <CreateSpendingForm key={formKey} groupId={groupId} onSuccess={handleSuccess} />
    </ResponsiveSheet>
  )
}
