'use client'

import { Button } from '@/components/ui/button'
import { useGetSpendingById } from '@/data/spendings'
import { Copy } from 'lucide-react'
import { useMemo } from 'react'
import { buildSpendingPrefillFromSpending } from '../forms/spending-prefill'
import { CreateSpendingSheet } from './create-spending-sheet'

export function DuplicateSpendingSheet ({
  groupId,
  spendId
}: {
  groupId: string
  spendId: string
}) {
  const { data: spending, isLoading } = useGetSpendingById({ spendingId: spendId })

  const prefill = useMemo(() => {
    if (!spending) return undefined
    return buildSpendingPrefillFromSpending(spending)
  }, [spending])

  if (isLoading || !prefill) {
    return (
      <Button variant="outline" size="sm" disabled>
        <Copy className="mr-2 h-4 w-4" />
        Duplicar
      </Button>
    )
  }

  return (
    <CreateSpendingSheet
      groupId={groupId}
      variant="outline"
      className="gap-2"
      label="Duplicar"
      icon={<><Copy className="mr-2 h-4 w-4" />Duplicar</>}
      prefill={prefill}
      title="Duplicar gasto"
      description="Mismo reparto y categoría; ajustá monto o fecha si hace falta."
    />
  )
}
