'use client'

import { CreateSpendingSheet } from '@/components/spendings/sheets/create-spending-sheet'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export function GroupWelcomeBanner ({ groupId }: { groupId: string }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(searchParams.get('joined') === '1')
  }, [searchParams])

  if (!visible) return null

  const dismiss = () => {
    setVisible(false)
    router.replace(`/groups/${groupId}`, { scroll: false })
  }

  return (
    <div className="surface-panel flex flex-col gap-3 border-primary/30 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="grid gap-1 pr-6 sm:pr-0">
        <p className="text-sm font-medium">¡Te uniste al grupo!</p>
        <p className="text-sm text-muted-foreground">
          Cargá el primer gasto o esperá a que alguien lo registre. Acá ves quién debe a quién.
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <CreateSpendingSheet groupId={groupId} variant="default" className="h-9" />
        <Button type="button" variant="ghost" size="icon" className="h-9 w-9" onClick={dismiss} aria-label="Cerrar">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
