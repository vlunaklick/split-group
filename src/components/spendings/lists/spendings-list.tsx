'use client'

import { CreateSpendingSheet } from '@/components/spendings/sheets/create-spending-sheet'
import { useGetSpendingsTable } from '@/data/spendings'
import { MobileSpendingTable, SpendingTable } from '../tables/spending-table'
import { GetSpendingsSchema } from '@/lib/validations'
import { useEffect } from 'react'
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton'

export const SpendingsList = ({ groupId, searchParams }: { groupId: string, searchParams: GetSpendingsSchema }) => {
  const { data, error, mutate, isLoading } = useGetSpendingsTable({ groupId, searchParams })

  useEffect(() => {
    mutate(['spendings-table', groupId])
  }, [searchParams])

  if (error) return <div className="text-sm text-muted-foreground">No se pudieron cargar los gastos</div>

  if (isLoading || !data) {
    return (
      <DataTableSkeleton
        columnCount={5}
        rowCount={10}
        searchableColumnCount={1}
        showViewOptions
        cellWidths={['auto', 'auto', 'auto', 'auto', 'auto']}
        withPagination
        shrinkZero
      />
    )
  }

  if (data.data?.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed py-12 text-center">
        <p className="text-muted-foreground">No hay gastos que coincidan</p>
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
