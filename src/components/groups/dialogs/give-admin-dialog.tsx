'use client'

import { ResponsiveDialog } from '@/components/responsive-dialog'
import { GiveAdminForm } from '../forms/give-admin-form'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { IconCrown } from '@tabler/icons-react'

export function GiveAdminDialog ({ groupId }: { groupId: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant='outline' size='icon'>
        <IconCrown className='w-4 h-4' />
      </Button>

      <ResponsiveDialog title='Otorgar permisos de administrador' description='Selecciona un miembro para otorgarle permisos de administrador.' isOpen={isOpen} setIsOpen={setIsOpen}>
        <GiveAdminForm groupId={groupId} />
      </ResponsiveDialog>
    </>
  )
}
