'use client'

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

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  return (
    <>
      {isLoading && (
        <DataTableSkeleton
          columnCount={5}
          rowCount={10}
          searchableColumnCount={1}
          showViewOptions
          cellWidths={['auto', 'auto', 'auto', 'auto', 'auto']}
          withPagination
          shrinkZero
        />
      )}
      {
        !isLoading && (
          <>
            <SpendingTable data={data} groupId={groupId}/>
            <MobileSpendingTable data={data?.data ?? []} groupId={groupId} />
          </>
        )
      }
    </>
  )
}
