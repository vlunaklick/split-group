'use client'

import { exportData } from '@/lib/exports'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { useMediaQuery } from '@/hooks/use-media-query'
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
  const isDesktop = useMediaQuery('(min-width: 768px)')

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

  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Exportar datos</DialogTitle>
            <DialogDescription>
              ¿En qué formato quieres exportar los datos?
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <ExportContent groupId={groupId} color={color} setColor={setColor} />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        {trigger}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Exportar datos</DrawerTitle>
          <DrawerDescription>
            ¿En qué formato quieres exportar los datos?
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 p-4">
          <ExportContent groupId={groupId} color={color} setColor={setColor} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
