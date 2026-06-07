import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'

export type UserOnboardingProgress = {
  hasGroup: boolean
  hasSpending: boolean
  hasMarkedPayment: boolean
  complete: boolean
}

export type GroupOnboardingProgress = {
  hasSpending: boolean
  hasInvited: boolean
  hasMarkedPayment: boolean
  complete: boolean
  memberCount: number
}

export async function getUserOnboardingProgress (): Promise<UserOnboardingProgress | null> {
  const session = await getServerSession(authOptions)
  const userId = session?.user.id

  if (!userId) return null

  const [groupCount, spendingCount, markedPaymentCount] = await Promise.all([
    db.group.count({
      where: { users: { some: { id: userId } } }
    }),
    db.spending.count({
      where: { group: { users: { some: { id: userId } } } }
    }),
    db.debt.count({
      where: {
        debterId: userId,
        paid: true,
        settledAt: { not: null }
      }
    })
  ])

  const hasGroup = groupCount > 0
  const hasSpending = spendingCount > 0
  const hasMarkedPayment = markedPaymentCount > 0

  return {
    hasGroup,
    hasSpending,
    hasMarkedPayment,
    complete: hasGroup && hasSpending && hasMarkedPayment
  }
}

export async function getGroupOnboardingProgress (groupId: string): Promise<GroupOnboardingProgress | null> {
  const session = await getServerSession(authOptions)
  const userId = session?.user.id

  if (!userId) return null

  const membership = await db.group.findFirst({
    where: {
      id: groupId,
      users: { some: { id: userId } }
    },
    select: {
      _count: { select: { users: true, spendings: true } }
    }
  })

  if (!membership) return null

  const markedPaymentCount = await db.debt.count({
    where: {
      debterId: userId,
      paid: true,
      settledAt: { not: null },
      spending: { groupId }
    }
  })

  const hasSpending = membership._count.spendings > 0
  const hasInvited = membership._count.users > 1
  const hasMarkedPayment = markedPaymentCount > 0

  return {
    hasSpending,
    hasInvited,
    hasMarkedPayment,
    complete: hasSpending && hasInvited && hasMarkedPayment,
    memberCount: membership._count.users
  }
}
