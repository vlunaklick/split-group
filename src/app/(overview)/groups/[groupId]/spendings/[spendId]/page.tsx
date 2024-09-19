import { CustomSpendingInfo, CustomSpendingInfoSkeleton } from '@/components/spendings/custom-spendings'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

export default async function GroupId ({ params } : { params: { groupId: string, spendId: string } }) {
  const { groupId, spendId } = params

  if (!groupId) {
    notFound()
  }

  return (
    <Suspense fallback={<CustomSpendingInfoSkeleton />}>
      <CustomSpendingInfo groupId={groupId} spendId={spendId} />
    </Suspense>
  )
}
