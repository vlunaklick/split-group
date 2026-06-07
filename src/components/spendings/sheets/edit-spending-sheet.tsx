'use client'

import { Button } from '@/components/ui/button'
import { ResponsiveSheet } from '@/components/responsive-sheet'
import { useState } from 'react'
import { EditSpendingForm } from '../forms/edit-spending-form'

export function EditSpendingSheet ({ spendId, groupId, className, show }: { spendId: string, groupId: string, className?: string, show: boolean }) {
  const [isOpen, setIsOpen] = useState(false)

  if (!show) return null

  return (
    <ResponsiveSheet
      open={isOpen}
      onOpenChange={setIsOpen}
      title="Editar gasto"
      description="Modifica los detalles, pagadores o división."
      trigger={
        <Button variant="outline" className={className}>
          Editar
        </Button>
      }
    >
      <EditSpendingForm spendId={spendId} groupId={groupId} callback={() => setIsOpen(false)} />
    </ResponsiveSheet>
  )
}
