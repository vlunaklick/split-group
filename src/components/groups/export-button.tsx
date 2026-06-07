'use client'

import { exportData } from '@/lib/exports'
import { Button } from '../ui/button'
import { ResponsiveSheet } from '../responsive-sheet'
import { IconDownload } from '@tabler/icons-react'
import { useState } from 'react'
import { ColorPicker } from '../color-picker'

function ExportContent ({ groupId, color, setColor }: { groupId: string, color: string, setColor: (v: string) => void }) {
  return (
    <>
      <p className="text-sm text-muted-foreground">Elige el color de acento para el archivo.</p>
      <ColorPicker value={color} onChange={(v) => setColor(v)} />
      <Button onClick={async () => await exportData({ groupId, type: 'excel', props: { color } })}>
        Exportar en Excel
      </Button>
      <Button variant="outline" onClick={async () => await exportData({ groupId, type: 'pdf', props: { color } })}>
        Exportar en PDF
      </Button>
    </>
  )
}

export function ExportButton ({ groupId, triggerIcon }: { groupId: string, triggerIcon?: boolean }) {
  const [color, setColor] = useState('#0f0f0f')

  const trigger = triggerIcon
    ? (
      <Button variant="outline" size="icon">
        <IconDownload className="h-4 w-4" />
        <span className="sr-only">Exportar</span>
      </Button>
      )
    : (
      <Button variant="outline">Exportar</Button>
      )

  return (
    <ResponsiveSheet
      title="Exportar datos"
      description="¿En qué formato quieres exportar los datos?"
      sheetWidth="425px"
      trigger={trigger}
    >
      <ExportContent groupId={groupId} color={color} setColor={setColor} />
    </ResponsiveSheet>
  )
}
