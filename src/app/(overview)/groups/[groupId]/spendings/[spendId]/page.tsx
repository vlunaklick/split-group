import { CustomSpendingInfo } from '@/components/spendings/custom-spendings'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

// TODO: Agregar un suspense

export default async function GroupId ({ params } : { params: { groupId: string, spendId: string } }) {
  const { groupId, spendId } = params

  if (!groupId) {
    notFound()
  }

  return (
    <Suspense fallback={null}>
      <CustomSpendingInfo groupId={groupId} spendId={spendId} />
    </Suspense>
  )
}
