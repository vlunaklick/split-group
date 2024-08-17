import { getGroup } from '@/lib/data'
import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import Link from 'next/link'
import { getSpending } from '../actions'
import { SpendInfo } from './info'
import { SpendDebts, SpendDebtsOwned } from './debts'
import { Contributors } from './contributors'
import { EditSpendSheet } from './edit-spend-sheet'
import { DeleteSpendDialog } from './delete-spend-dialog'

export default async function GroupId ({ params } : { params: { groupId: string, spendId: string } }) {
  const { groupId, spendId } = params

  if (!groupId) {
    notFound()
  }

  const session = await getServerSession(authOptions)
  const group = await getGroup(groupId)
  const spend = await getSpending({ spendingId: spendId })

  if (!group || !group.users.find(user => user.id === session?.user?.id) || !spend) {
    notFound()
  }

  return (
    <>
      <header className="flex md:items-center gap-4 flex-col md:flex-row">
        <h1 className="text-3xl font-semibold">
          {group.name}
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
              {spend.name}
            </BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>

        {
          session?.user?.id === spend.ownerId && (
            <div className="ml-auto space-x-4">
              <DeleteSpendDialog groupId={groupId} spendId={spendId} />
              <EditSpendSheet groupId={groupId} spendId={spendId} userId={session?.user?.id as string} />
            </div>
          )
        }
      </header>

      <div className="flex gap-4 w-full md:justify-start justify-center flex-col md:flex-row">
        <div className="flex gap-4 flex-col w-full">
          <div className="flex flex-col md:hidden gap-4">
            <SpendDebtsOwned groupId={groupId} spendId={spendId} userId={session?.user?.id as string} />
            <SpendDebts groupId={groupId} spendId={spendId} userId={session?.user?.id as string} />
          </div>
          <SpendInfo groupId={groupId} spendId={spendId} userId={session?.user?.id as string} />
        </div>

        <div className="flex flex-col gap-4 w-full">
          <Contributors groupId={groupId} spendId={spendId} />
          <div className="hidden md:flex flex-col gap-4">
          <SpendDebtsOwned groupId={groupId} spendId={spendId} userId={session?.user?.id as string} />
          <SpendDebts groupId={groupId} spendId={spendId} userId={session?.user?.id as string} />
          </div>
        </div>
      </div>
    </>
  )
}
