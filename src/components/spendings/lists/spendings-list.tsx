'use client'

import { useGetSpendingsTable } from '@/data/spendings'
import { MobileSpendingTable, SpendingTable } from '../tables/spending-table'

export const SpendingsList = ({ groupId }: { groupId: string }) => {
  const { data, error } = useGetSpendingsTable({ groupId })

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  return (
    <>
      <SpendingTable data={data} groupId={groupId}/>
      <MobileSpendingTable data={data} groupId={groupId} />
    </>
  )
}
