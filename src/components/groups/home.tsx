import { getGroup } from '@/data/apis/groups'
import { notFound } from 'next/navigation'
import { HeaderButtons, HeaderButtonsMobile, HeaderButtonsSkeletons } from './home-header-buttons'
import { Spendings, SpendingsSkeleton } from './spendings'
import { Debts, DebtsSkeleton } from './debts'
import { GroupNav } from './group-nav'
import { Skeleton } from '../ui/skeleton'
import { Suspense } from 'react'

export async function GroupHome ({ groupId }: { groupId: string }) {
  const data = await getGroup(groupId)

  if (!data.group) {
    notFound()
  }

  return (
    <>
      <header className="flex flex-col gap-4">
        <div className="flex md:justify-between md:items-start gap-4 flex-col md:flex-row">
          <div className="flex flex-col gap-2 flex-1">
            <div className="flex items-start gap-2 justify-between">
              <h1 className="text-display-sm">{data.group.name}</h1>
              <HeaderButtonsMobile groupId={groupId} />
            </div>
            {data.group.description && (
              <p className="text-balance text-muted-foreground">{data.group.description}</p>
            )}
          </div>

          <div className="hidden md:flex gap-2 shrink-0">
            <Suspense fallback={<HeaderButtonsSkeletons />}>
              <HeaderButtons groupId={groupId} />
            </Suspense>
          </div>
        </div>

        <GroupNav groupId={groupId} />
      </header>

      <div className="flex flex-col gap-4 md:flex-row md:gap-8">
        <div className="order-2 md:order-1 flex-1">
          <Spendings groupId={groupId} />
        </div>
        <div className="order-1 md:order-2">
          <Debts groupId={groupId} />
        </div>
      </div>
    </>
  )
}

export const GroupHomeSkeleton = () => {
  return (
    <>
      <header className="flex flex-col gap-4">
        <div className="flex md:justify-between md:items-start gap-4 flex-col md:flex-row">
          <div className="flex flex-col gap-2 flex-1">
            <Skeleton className="w-40 h-9" />
            <Skeleton className="w-40 h-6" />
          </div>
          <div className="hidden md:flex gap-2">
            <HeaderButtonsSkeletons />
          </div>
        </div>
        <Skeleton className="w-full h-10" />
      </header>

      <div className="flex flex-col gap-4 md:flex-row md:gap-8">
        <SpendingsSkeleton />
        <DebtsSkeleton />
      </div>
    </>
  )
}
