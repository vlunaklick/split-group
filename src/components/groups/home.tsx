import { getGroup } from '@/data/apis/groups'
import { notFound } from 'next/navigation'
import { HeaderButtons, HeaderButtonsMobile, HeaderButtonsSkeletons } from './home-header-buttons'
import { Spendings, SpendingsSkeleton } from './spendings'
import { Debts, DebtsSkeleton } from './debts'
import { GroupPageHeader } from './group-page-header'
import { Skeleton } from '../ui/skeleton'
import { Suspense } from 'react'

export async function GroupHome ({ groupId }: { groupId: string }) {
  const data = await getGroup(groupId)

  if (!data.group) {
    notFound()
  }

  return (
    <>
      <GroupPageHeader
        groupId={groupId}
        groupName={data.group.name}
        description={data.group.description ?? undefined}
        actions={
          <>
            <HeaderButtonsMobile groupId={groupId} />
            <div className="hidden md:flex gap-2">
              <Suspense fallback={<HeaderButtonsSkeletons />}>
                <HeaderButtons groupId={groupId} />
              </Suspense>
            </div>
          </>
        }
      />

      <div className="grid w-full gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,380px)] lg:gap-8">
        <div className="order-2 min-w-0 lg:order-1">
          <Spendings groupId={groupId} />
        </div>
        <div className="order-1 min-w-0 lg:order-2">
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

      <div className="grid w-full gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,380px)] lg:gap-8">
        <SpendingsSkeleton />
        <DebtsSkeleton />
      </div>
    </>
  )
}
