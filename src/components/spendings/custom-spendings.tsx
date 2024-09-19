import { getCustomSpending } from '@/data/apis/spendings'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../ui/breadcrumb'
import { DeleteSpendingDialog } from './dialogs/delete-spend-dialog'
import { ContributorsList, ContributorsListSkeleton } from './lists/contributors-list'
import { SpendingDebtsList, SpendingDebtsListSkeleton } from './lists/spending-debts-list'
import { SpendingDebtsOwedList, SpendingDebtsOwedListSkeleton } from './lists/spending-debts-owed-list'
import { EditSpendingSheet } from './sheets/edit-spending-sheet'
import { SpendInfoSkeleton, SpendingInfo } from './spending-info'
import { CommentsSheet } from './sheets/comments-sheet'
import { Skeleton } from '../ui/skeleton'

export async function CustomSpendingInfo ({ groupId, spendId }: { groupId: string, spendId: string }) {
  const data = await getCustomSpending({ groupId, spendingId: spendId })

  if (!data) {
    notFound()
  }

  return (
    <>
      <header className="flex lg:items-center gap-4 flex-col lg:flex-row">
        <h1 className="text-3xl font-semibold">
          {data.spend?.group.name}
        </h1>

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/groups/${groupId}`}>Grupo</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbLink asChild>
              <Link href={`/groups/${groupId}/spendings`}>Gastos</Link>
            </BreadcrumbLink>
            <BreadcrumbSeparator />
            <BreadcrumbPage>
              {data.spend?.name}
            </BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="md:ml-auto flex gap-2 flex-wrap">
          <CommentsSheet spendingId={spendId} />

          {data.isOwner && (
            <>
              <DeleteSpendingDialog groupId={groupId} spendId={spendId} />
              <EditSpendingSheet groupId={groupId} spendId={spendId} />
            </>
          )}
        </div>
      </header>

      <div className="flex gap-4 w-full md:justify-start justify-center flex-col md:flex-row">
        <div className="flex gap-4 flex-col w-full">
          <div className="flex flex-col md:hidden gap-4">
            <SpendingDebtsOwedList groupId={groupId} spendId={spendId} />
            <SpendingDebtsList groupId={groupId} spendId={spendId} />
          </div>
          <SpendingInfo spendId={spendId} />
        </div>

        <div className="flex flex-col gap-4 w-full">
          <ContributorsList groupId={groupId} spendId={spendId} />
          <div className="hidden md:flex flex-col gap-4">
            <SpendingDebtsOwedList groupId={groupId} spendId={spendId} />
            <SpendingDebtsList groupId={groupId} spendId={spendId} />
          </div>
        </div>
      </div>
    </>
  )
}

export const CustomSpendingInfoSkeleton = () => {
  return (
    <>
      <header className="flex md:justify-between md:items-center gap-4 flex-col md:flex-row">
        <div className="flex flex-col gap-2">
          <Skeleton className="w-40 h-10" />
        </div>
      </header>

      <div className="flex gap-4 w-full md:justify-start justify-center flex-col md:flex-row">
        <div className="flex gap-4 flex-col w-full">
          <div className="flex flex-col md:hidden gap-4">
            <SpendingDebtsOwedListSkeleton />
            <SpendingDebtsListSkeleton />
          </div>
          <SpendInfoSkeleton />
        </div>

        <div className="flex flex-col gap-4 w-full">
          <ContributorsListSkeleton />
          <div className="hidden md:flex flex-col gap-4">
            <SpendingDebtsOwedListSkeleton />
            <SpendingDebtsListSkeleton />
          </div>
        </div>
      </div>
    </>
  )
}
