'use client'

import { CreateSpendingSheet } from '@/components/spendings/sheets/create-spending-sheet'
import { useGetSpendingsTable } from '@/data/spendings'
import { MobileSpendingTable, SpendingTable } from '../tables/spending-table'
import { GetSpendingsSchema } from '@/lib/validations'
import { useEffect } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export const SpendingsList = ({ groupId, searchParams }: { groupId: string, searchParams: GetSpendingsSchema }) => {
  const { data, error, mutate, isLoading } = useGetSpendingsTable({ groupId, searchParams })

  useEffect(() => {
    mutate(['spendings-table', groupId])
  }, [searchParams])

  if (error) return <div className="text-sm text-muted-foreground">No se pudieron cargar los gastos</div>

  if (isLoading || !data) {
    return (
      <div className="grid gap-3">
        <Skeleton className="h-9 w-full max-w-xs" />
        <ul className="divide-y divide-border rounded-lg border border-border">
          {Array.from({ length: 5 }).map((_, i) => (
            <li key={i} className="flex items-center gap-3 px-4 py-3">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-4 w-16" />
            </li>
          ))}
        </ul>
      </div>
    )
  }

  if (data.data?.length === 0) {
    return (
      <div className="flex flex-col items-start gap-3 py-8">
        <p className="text-sm text-muted-foreground">No hay gastos todavía.</p>
        <CreateSpendingSheet groupId={groupId} variant="default" />
      </div>
    )
  }

  return (
    <>
      <div className="hidden sm:block">
        <SpendingTable data={data} groupId={groupId} />
      </div>
      <MobileSpendingTable data={data.data ?? []} groupId={groupId} />
    </>
  )
}
