'use client'

import { exportData } from '@/lib/exports'
import { Button } from '../ui/button'
import { ResponsiveSheet } from '../responsive-sheet'
import { IconDownload } from '@tabler/icons-react'
import { useState } from 'react'
import { ColorPicker } from '../color-picker'
import { displayToast } from '@/utils/toast-display'

function ExportContent ({ groupId, color, setColor }: { groupId: string, color: string, setColor: (v: string) => void }) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async (type: 'excel' | 'pdf') => {
    setIsExporting(true)
    try {
      await exportData({ groupId, type, props: { color } })
      displayToast(type === 'excel' ? 'Excel descargado' : 'PDF descargado', 'success')
    } catch {
      displayToast('No se pudo exportar', 'error')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="grid gap-4">
      <p className="text-sm text-muted-foreground">Elegí formato y color de acento.</p>
      <ColorPicker value={color} onChange={(v) => setColor(v)} />
      <Button disabled={isExporting} onClick={() => handleExport('excel')}>
        Descargar Excel
      </Button>
      <Button variant="outline" disabled={isExporting} onClick={() => handleExport('pdf')}>
        Descargar PDF
      </Button>
    </div>
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
      title="Exportar grupo"
      description="Descargá gastos y balances del grupo."
      sheetWidth="425px"
      trigger={trigger}
    >
      <ExportContent groupId={groupId} color={color} setColor={setColor} />
    </ResponsiveSheet>
  )
}
