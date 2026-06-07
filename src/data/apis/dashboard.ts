import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { startOfWeek, endOfWeek } from 'date-fns'
import { getServerSession } from 'next-auth'

export type DashboardGroupLastSpending = {
  name: string
  createdAt: Date
  value: number
}

export type DashboardGroup = {
  id: string
  name: string
  icon: string | null
  netBalance: number
  memberCount: number
  spendingCount: number
  lastSpending: DashboardGroupLastSpending | null
}

export type DashboardPendingItem = {
  groupId: string
  groupName: string
  personName: string
  personId: string
  amount: number
}

export type DashboardStats = {
  monthlySpent: number
  monthlySpentPrev: number
  weeklySpent: number
  weeklySpentPrev: number
  totalSpendings: number
  openDebtsCount: number
  groupCount: number
}

export type DashboardOverview = {
  totalDebt: number
  totalRevenue: number
  netBalance: number
  groups: DashboardGroup[]
  pending: DashboardPendingItem[]
  stats: DashboardStats
}

export async function getDashboardOverview (): Promise<DashboardOverview> {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  if (!userId) {
    return {
      totalDebt: 0,
      totalRevenue: 0,
      netBalance: 0,
      groups: [],
      pending: [],
      stats: {
        monthlySpent: 0,
        monthlySpentPrev: 0,
        weeklySpent: 0,
        weeklySpentPrev: 0,
        totalSpendings: 0,
        openDebtsCount: 0,
        groupCount: 0
      }
    }
  }

  const [groupsData, debts, monthlyData, weeklyData, totalSpendings] = await Promise.all([
    db.group.findMany({
      where: { users: { some: { id: userId } } },
      select: {
        id: true,
        name: true,
        icon: true,
        _count: { select: { users: true, spendings: true } },
        spendings: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { name: true, createdAt: true, value: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    }),
    db.debt.findMany({
      where: {
        paid: false,
        forgiven: false,
        OR: [
          { debterId: userId },
          { creditorId: userId }
        ]
      },
      include: {
        debter: { select: { id: true, name: true } },
        creditor: { select: { id: true, name: true } },
        spending: {
          include: {
            group: { select: { id: true, name: true } }
          }
        }
      }
    }),
    getMonthlySpent(),
    getWeeklySpent(),
    db.spending.count({
      where: { group: { users: { some: { id: userId } } } }
    })
  ])

  let totalDebt = 0
  let totalRevenue = 0
  const groupBalances = new Map<string, number>()
  const pendingMap = new Map<string, DashboardPendingItem>()

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
          groupId,
          groupName,
          personName: debt.creditor.name ?? 'Usuario',
          personId: debt.creditorId,
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
          groupId,
          groupName,
          personName: debt.debter.name ?? 'Usuario',
          personId: debt.debterId,
          amount: debt.amount
        })
      }
    }
  }

  const pending = Array.from(pendingMap.values())
    .filter((item) => item.amount !== 0)
    .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
    .slice(0, 8)

  return {
    totalDebt,
    totalRevenue,
    netBalance: totalRevenue - totalDebt,
    groups: groupsData.map((group) => {
      const last = group.spendings[0]

      return {
        id: group.id,
        name: group.name,
        icon: group.icon,
        netBalance: groupBalances.get(group.id) ?? 0,
        memberCount: group._count.users,
        spendingCount: group._count.spendings,
        lastSpending: last
          ? { name: last.name, createdAt: last.createdAt, value: last.value }
          : null
      }
    }),
    pending,
    stats: {
      monthlySpent: monthlyData.totalSpentThisMonth,
      monthlySpentPrev: monthlyData.totalSpentLastMonth,
      weeklySpent: weeklyData.totalSpentThisWeek,
      weeklySpentPrev: weeklyData.totalSpentLastWeek,
      totalSpendings,
      openDebtsCount: pending.length,
      groupCount: groupsData.length
    }
  }
}

export async function getMembersTotal () {
  const members = await db.user.count()

  return members
}

export const getMonthlySpent = async () => {
  const session = await getServerSession(authOptions)
  const userId = session?.user.id

  const spent = await db.debt.findMany({
    where: {
      debterId: userId,
      spending: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
        }
      }
    }
  })

  const lastMonthSpent = await db.debt.findMany({
    where: {
      debterId: userId,
      spending: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
          lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    }
  })

  const totalSpentThisMonth = spent.reduce((acc, curr) => acc + curr.amount, 0)
  const totalSpentLastMonth = lastMonthSpent.reduce((acc, curr) => acc + curr.amount, 0)

  return {
    totalSpentThisMonth,
    totalSpentLastMonth
  }
}

export const getWeeklySpent = async () => {
  const session = await getServerSession(authOptions)
  const userId = session?.user.id

  const spent = await db.debt.findMany({
    where: {
      debterId: userId,
      spending: {
        createdAt: {
          gte: startOfWeek(new Date(), { weekStartsOn: 1 }),
          lt: endOfWeek(new Date(), { weekStartsOn: 1 })
        }
      }
    }
  })

  const lastWeekSpent = await db.debt.findMany({
    where: {
      debterId: userId,
      spending: {
        createdAt: {
          gte: startOfWeek(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 7), { weekStartsOn: 1 }),
          lt: endOfWeek(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 7), { weekStartsOn: 1 })
        }
      }
    }
  })

  const totalSpentThisWeek = spent.reduce((acc, curr) => acc + curr.amount, 0)
  const totalSpentLastWeek = lastWeekSpent.reduce((acc, curr) => acc + curr.amount, 0)

  return {
    totalSpentThisWeek,
    totalSpentLastWeek
  }
}

export const getTotalDebt = async () => {
  const session = await getServerSession(authOptions)
  const userId = session?.user.id

  const debts = await db.debt.findMany({
    where: {
      debterId: userId,
      paid: false,
      forgiven: false
    }
  })

  const totalDebt = debts.reduce((acc, curr) => acc + curr.amount, 0)

  return {
    totalDebt
  }
}

export const getTotalRevenue = async () => {
  const session = await getServerSession(authOptions)
  const userId = session?.user.id

  const revenues = await db.debt.findMany({
    where: {
      creditorId: userId,
      paid: false,
      forgiven: false
    }
  })

  const totalRevenue = revenues.reduce((acc, curr) => acc + curr.amount, 0)

  return {
    totalRevenue
  }
}

export const getMontlySpentGraph = async () => {
  const session = await getServerSession(authOptions)
  const userId = session?.user.id

  // We need to calculate the total spent for each month of the year
  // and return it in an array of objects
  // [{ month: 'January', totalSpent: 1000 }, { month: 'February', totalSpent: 2000 }]

  const spent = await db.debt.findMany({
    where: {
      debterId: userId
    },
    include: {
      spending: true
    }
  })

  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

  const monthlySpent = months.map((month, index) => {
    const totalSpent = spent.reduce((acc, curr) => {
      if (new Date(curr.spending.createdAt).getMonth() === index) {
        return acc + curr.amount
      }

      return acc
    }, 0)

    return {
      month,
      totalSpent
    }
  })

  return monthlySpent
}

export const getLatestSpendings = async () => {
  const session = await getServerSession(authOptions)
  const userId = session?.user.id

  const latestSpendings = await db.spending.findMany({
    where: {
      group: {
        users: {
          some: {
            id: userId
          }
        }
      }
    },
    include: {
      group: true,
      owner: true,
      category: true
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 12
  })

  return latestSpendings
}
