import { Spendings, SpendingsPageSkeleton } from '@/components/spendings/spendings'
import { searchParamsSchema } from '@/lib/validations'
import { SearchParams } from '@/types'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

export default async function GroupId ({ params, searchParams } : { params: { groupId: string }, searchParams: SearchParams }) {
  const groupId = params.groupId

  if (!groupId) {
    notFound()
  }

  const search = searchParamsSchema.parse(searchParams)

  return (
    <Suspense fallback={<SpendingsPageSkeleton />}>
      <Spendings groupId={groupId} searchParams={search} />
    </Suspense>
  )
}
