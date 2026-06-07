import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { endOfWeek, startOfWeek } from 'date-fns'
import { getServerSession } from 'next-auth'

export type WeeklyDigestData = {
  userName: string
  email: string
  netBalance: number
  totalDebt: number
  totalRevenue: number
  weeklySpent: number
  groupCount: number
  pendingCount: number
  groups: { name: string, netBalance: number }[]
  pending: { personName: string, groupName: string, amount: number }[]
  recentSpendings: { name: string, groupName: string, value: number }[]
}

export async function getWeeklyDigestData (userId: string): Promise<WeeklyDigestData | null> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true }
  })

  if (!user?.email) return null

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 })

  const [groupsData, debts, weeklyDebts, recentSpendings] = await Promise.all([
    db.group.findMany({
      where: { users: { some: { id: userId } } },
      select: { id: true, name: true },
      orderBy: { updatedAt: 'desc' }
    }),
    db.debt.findMany({
      where: {
        paid: false,
        forgiven: false,
        OR: [{ debterId: userId }, { creditorId: userId }]
      },
      include: {
        debter: { select: { name: true } },
        creditor: { select: { name: true } },
        spending: { include: { group: { select: { name: true } } } }
      }
    }),
    db.debt.findMany({
      where: {
        debterId: userId,
        spending: {
          createdAt: { gte: weekStart, lt: weekEnd }
        }
      }
    }),
    db.spending.findMany({
      where: {
        group: { users: { some: { id: userId } } },
        createdAt: { gte: weekStart }
      },
      include: { group: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      take: 5
    })
  ])

  let totalDebt = 0
  let totalRevenue = 0
  const groupBalances = new Map<string, number>()
  const pendingMap = new Map<string, { personName: string, groupName: string, amount: number }>()

  for (const debt of debts) {
    const groupId = debt.spending.groupId
    const groupName = debt.spending.group.name

    if (debt.debterId === userId) {
      totalDebt += debt.amount
      groupBalances.set(groupId, (groupBalances.get(groupId) ?? 0) - debt.amount)

      const key = `${groupId}-${debt.creditorId}-owe`
      const existing = pendingMap.get(key)
      if (existing) {
        existing.amount -= debt.amount
      } else {
        pendingMap.set(key, {
          personName: debt.creditor.name ?? 'Usuario',
          groupName,
          amount: -debt.amount
        })
      }
    } else {
      totalRevenue += debt.amount
      groupBalances.set(groupId, (groupBalances.get(groupId) ?? 0) + debt.amount)

      const key = `${groupId}-${debt.debterId}-owed`
      const existing = pendingMap.get(key)
      if (existing) {
        existing.amount += debt.amount
      } else {
        pendingMap.set(key, {
          personName: debt.debter.name ?? 'Usuario',
          groupName,
          amount: debt.amount
        })
      }
    }
  }

  const pending = Array.from(pendingMap.values())
    .filter((item) => item.amount !== 0)
    .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
    .slice(0, 5)

  const weeklySpent = weeklyDebts.reduce((acc, debt) => acc + debt.amount, 0)

  return {
    userName: user.name ?? 'Usuario',
    email: user.email,
    netBalance: totalRevenue - totalDebt,
    totalDebt,
    totalRevenue,
    weeklySpent,
    groupCount: groupsData.length,
    pendingCount: pending.length,
    groups: groupsData.map((group) => ({
      name: group.name,
      netBalance: groupBalances.get(group.id) ?? 0
    })),
    pending,
    recentSpendings: recentSpendings.map((spending) => ({
      name: spending.name,
      groupName: spending.group.name,
      value: spending.value
    }))
  }
}

export async function getWeeklyDigestForSession () {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id
  if (!userId) return null
  return getWeeklyDigestData(userId)
}
