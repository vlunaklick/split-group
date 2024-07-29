'use server'

import { db } from '@/lib/db'
import { startOfWeek, endOfWeek } from 'date-fns'

export const getMonthlySpent = async ({ userId }: { userId: string }) => {
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

export const getWeeklySpent = async ({ userId }: { userId: string }) => {
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

export const getTotalDebt = async ({ userId }: { userId: string }) => {
  const debts = await db.debt.findMany({
    where: {
      debterId: userId
    }
  })

  const totalDebt = debts.reduce((acc, curr) => acc + curr.amount, 0)

  return {
    totalDebt
  }
}

export const getTotalRevenue = async ({ userId }: { userId: string }) => {
  const revenues = await db.debt.findMany({
    where: {
      creditorId: userId
    }
  })

  const totalRevenue = revenues.reduce((acc, curr) => acc + curr.amount, 0)

  return {
    totalRevenue
  }
}

export const getMontlySpentGraph = async ({ userId }: { userId: string }) => {
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
