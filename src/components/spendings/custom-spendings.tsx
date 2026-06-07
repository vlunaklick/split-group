import { getCustomSpending } from '@/data/apis/spendings'
import { formatMoney } from '@/lib/money'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { buttonVariants } from '../ui/button'
import { DeleteSpendingDialog } from './dialogs/delete-spend-dialog'
import { ContributorsList, ContributorsListSkeleton } from './lists/contributors-list'
import { SpendingDebtsList, SpendingDebtsListSkeleton } from './lists/spending-debts-list'
import { SpendingDebtsOwedList, SpendingDebtsOwedListSkeleton } from './lists/spending-debts-owed-list'
import { DuplicateSpendingSheet } from './sheets/duplicate-spending-sheet'
import { EditSpendingSheet } from './sheets/edit-spending-sheet'
import { SpendInfoSkeleton, SpendingInfo } from './spending-info'
import { CommentsSheet } from './sheets/comments-sheet'
import { Skeleton } from '../ui/skeleton'
import { cn } from '@/lib/utils'
import { IconArrowLeft } from '@tabler/icons-react'

export async function CustomSpendingInfo ({ groupId, spendId }: { groupId: string, spendId: string }) {
  const data = await getCustomSpending({ groupId, spendingId: spendId })

  if (!data?.spend) {
    notFound()
  }

  return (
    <>
      <header className="flex flex-col gap-4">
        <Link
          href={`/groups/${groupId}/spendings`}
          className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'w-fit -ml-2 text-muted-foreground')}
        >
          <IconArrowLeft className="h-4 w-4" />
          Volver a gastos
        </Link>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="grid gap-1">
            <p className="text-sm text-muted-foreground">{data.spend.group.name}</p>
            <h1 className="text-display-sm">{data.spend.name}</h1>
            <p className="font-mono text-xl text-foreground">{formatMoney(data.spend.value)}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <DuplicateSpendingSheet groupId={groupId} spendId={spendId} />
            <CommentsSheet spendingId={spendId} />
            {data.isOwner && (
              <>
                <EditSpendingSheet groupId={groupId} spendId={spendId} show={data.isOwner} />
                <DeleteSpendingDialog groupId={groupId} spendId={spendId} show={data.isOwner} />
              </>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex w-full flex-col gap-4 md:order-2 md:max-w-sm">
          <div className="flex flex-col gap-4 md:hidden">
            <SpendingDebtsOwedList groupId={groupId} spendId={spendId} />
            <SpendingDebtsList groupId={groupId} spendId={spendId} />
          </div>
          <SpendingInfo spendId={spendId} compact />
        </div>

        <div className="flex w-full flex-col gap-4 md:order-1">
          <ContributorsList groupId={groupId} spendId={spendId} />
          <div className="hidden flex-col gap-4 md:flex">
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
      <header className="flex flex-col gap-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-8 w-24" />
      </header>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex w-full flex-col gap-4 md:order-2 md:max-w-sm">
          <SpendInfoSkeleton />
        </div>
        <div className="flex w-full flex-col gap-4 md:order-1">
          <ContributorsListSkeleton />
        </div>
      </div>
    </>
  )
}
