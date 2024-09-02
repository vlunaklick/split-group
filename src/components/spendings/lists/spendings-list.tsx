'use client'

import { useGetSpendingsTable } from '@/data/spendings'
import { MobileSpendingTable, SpendingTable } from '../tables/spending-table'
import { GetSpendingsSchema } from '@/lib/validations'
import { useEffect } from 'react'

export const SpendingsList = ({ groupId, searchParams }: { groupId: string, searchParams: GetSpendingsSchema }) => {
  const { data, error, mutate } = useGetSpendingsTable({ groupId, searchParams })

  useEffect(() => {
    mutate(['spendings-table', groupId])
  }, [searchParams])

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  return (
    <>
      <SpendingTable data={data} groupId={groupId}/>
      <MobileSpendingTable data={data?.data ?? []} groupId={groupId} />
    </>
  )
}
