import { getCustomSpending } from '@/data/apis/spendings'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../ui/breadcrumb'
import { DeleteSpendingDialog } from './dialogs/delete-spend-dialog'
import { ContributorsList } from './lists/contributors-list'
import { SpendingDebtsList } from './lists/spending-debts-list'
import { SpendingDebtsOwedList } from './lists/spending-debts-owed-list'
import { EditSpendingSheet } from './sheets/edit-spending-sheet'
import { SpendingInfo } from './spending-info'
import { CommentsSheet } from './sheets/comments-sheet'

export async function CustomSpendingInfo ({ groupId, spendId }: { groupId: string, spendId: string }) {
  const data = await getCustomSpending({ groupId, spendingId: spendId })

  if (!data) {
    notFound()
  }

  return (
    <>
      <header className="flex md:items-center gap-4 flex-col md:flex-row">
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
        <div className="ml-auto space-x-4">
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
