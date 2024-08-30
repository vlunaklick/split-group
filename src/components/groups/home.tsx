import { getGroup } from '@/data/actions/groups'
import { notFound } from 'next/navigation'
import { HeaderButtons, HeaderButtonsMobile, HeaderButtonsSkeletons } from './home-header-buttons'
import { Spendings, SpendingsSkeleton } from './spendings'
import { Debts, DebtsSkeleton } from './debts'
import { Skeleton } from '../ui/skeleton'
import { Suspense } from 'react'

export async function GroupHome ({ groupId }: { groupId: string }) {
  const group = await getGroup(groupId)

  if (!group) {
    notFound()
  }

  return (
    <>
      <header className="flex md:justify-between md:items-center gap-4 flex-col md:flex-row">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 justify-between">
            <h1 className="text-3xl font-semibold">{group.name}</h1>
            <HeaderButtonsMobile groupId={groupId} />
          </div>
          <p className="text-balance text-muted-foreground">{group.description}</p>
        </div>

        <div className="flex gap-2">
          <Suspense fallback={<HeaderButtonsSkeletons />}>
            <HeaderButtons groupId={groupId} />
          </Suspense>
        </div>
      </header>

      <div className="flex flex-col gap-4 md:flex-row md:gap-8">
        <Spendings groupId={groupId} />
        <Debts groupId={groupId} />
      </div>
    </>
  )
}

export const GroupHomeSkeleton = () => {
  return (
    <>
      <header className="flex md:justify-between md:items-center gap-4 flex-col md:flex-row">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 justify-between">
            <Skeleton className="w-40 h-9" />
          </div>

          <Skeleton className="w-40 h-6" />
        </div>

        <div className="flex gap-2">
          <HeaderButtonsSkeletons />
        </div>
      </header>

      <div className="flex flex-col gap-4 md:flex-row md:gap-8">
        <SpendingsSkeleton />
        <DebtsSkeleton />
      </div>
    </>
  )
}
