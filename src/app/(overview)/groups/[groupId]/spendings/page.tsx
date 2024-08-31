import { Spendings } from '@/components/spendings/spendings'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

export default async function GroupId ({ params } : { params: { groupId: string } }) {
  const groupId = params.groupId

  if (!groupId) {
    notFound()
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Spendings groupId={groupId} />
    </Suspense>
  )
}
