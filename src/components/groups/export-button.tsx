'use client'

import { exportData } from '@/lib/exports'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useState } from 'react'
import { ColorPicker } from '../color-picker'

export function ExportButton ({ groupId }: { groupId: string }) {
  const [color, setColor] = useState('#0f0f0f')

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Exportar</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Exportar datos</DialogTitle>
          <DialogDescription>
            En que formato deseas exportar los datos?
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-4">
          <p>Selecciona que color de acentuación deseas para el archivo.</p>

          <ColorPicker value={color} onChange={(v) => setColor(v)} />
        </div>

        <Button onClick={async () => await exportData({ groupId, type: 'excel', props: { color } })}>
          Exportar en Excel
        </Button>

        <Button onClick={async () => await exportData({ groupId, type: 'pdf', props: { color } })}>
          Exportar en PDF
        </Button>
      </DialogContent>
    </Dialog>
  )
}
