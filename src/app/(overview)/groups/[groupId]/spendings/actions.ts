'use server'

import { db } from '@/lib/db'
import { DistributionModeType, SpendingInfo } from './types'
import { handleDistribution } from '@/utils/distributions'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function createSpending ({ groupId, spending, mode }: { groupId: string, spending: SpendingInfo, mode: DistributionModeType }) {
  const session = await getServerSession(authOptions)
  const userId = session?.user.id

  if (!userId) return

  const createdSpending = await db.spending.create({
    data: {
      groupId,
      ownerId: spending.userId,
      date: spending.date,
      name: spending.name,
      description: spending.description,
      categoryId: spending.categoryId,
      currencyId: spending.currencyId,
      value: spending.amount
    }
  })

  // Agregamos quiénes son los que lo pagaron y cuánto pusieron
  for (const user of spending.payers) {
    await db.payment.create({
      data: {
        payerId: user.userId,
        amount: user.amount,
        spendingId: createdSpending.id
      }
    })
  }

  const payments = handleDistribution({ type: mode, spending })

  if (!payments) return

  for (const payment of payments) {
    await db.debt.create({
      data: {
        spendingId: createdSpending.id,
        amount: payment.amount,
        debterId: payment.from,
        creditorId: payment.to,
        paid: false,
        forgiven: false
      }
    })
  }
}

export async function updateSpending ({ spendingId, spending, mode }: { spendingId: string, spending: SpendingInfo, mode: DistributionModeType }) {
  // Actualizamos el gasto
  await db.spending.update({
    where: {
      id: spendingId
    },
    data: {
      date: spending.date,
      name: spending.name,
      description: spending.description,
      categoryId: spending.categoryId,
      currencyId: spending.currencyId,
      value: spending.amount
    }
  })

  // borramos los pagadores y los involucrados
  await db.payment.deleteMany({
    where: {
      spendingId
    }
  })

  await db.debt.deleteMany({
    where: {
      spendingId
    }
  })

  // Agregamos quiénes son los que lo pagaron y cuánto pusieron
  for (const user of spending.payers) {
    await db.payment.create({
      data: {
        payerId: user.userId,
        amount: user.amount,
        spendingId
      }
    })
  }

  const payments = handleDistribution({ type: mode, spending })

  if (!payments) return

  for (const payment of payments) {
    await db.debt.create({
      data: {
        spendingId,
        amount: payment.amount,
        debterId: payment.from,
        creditorId: payment.to,
        paid: false,
        forgiven: false
      }
    })
  }
}

export async function deleteSpending ({ spendingId }: { spendingId: string }) {
  await db.payment.deleteMany({
    where: {
      spendingId
    }
  })

  await db.debt.deleteMany({
    where: {
      spendingId
    }
  })

  await db.spending.delete({
    where: {
      id: spendingId
    }
  })
}

export async function getSpending ({ spendingId }: { spendingId: string }) {
  return db.spending.findUnique({
    where: {
      id: spendingId
    },
    include: {
      payments: true,
      debts: true,
      category: true,
      owner: true,
      currency: true
    }
  })
}

export async function getCommentsOfSpending ({ spendingId }: { spendingId: string }) {
  return db.comment.findMany({
    where: {
      spendingId
    },
    include: {
      user: true
    }
  })
}

export async function createComment ({ spendingId, comment }: { spendingId: string, comment: any }) {
  return db.comment.create({
    data: {
      spendingId,
      userId: comment.userId,
      content: comment.content
    }
  })
}

export async function deleteComment ({ commentId }: { commentId: string }) {
  return db.comment.delete({
    where: {
      id: commentId
    }
  })
}

export async function payDebt ({ debtId }: { debtId: string }) {
  return db.debt.update({
    where: {
      id: debtId
    },
    data: {
      paid: true
    }
  })
}

export async function forgiveDebt ({ debtId }: { debtId: string }) {
  return db.debt.update({
    where: {
      id: debtId
    },
    data: {
      forgiven: true
    }
  })
}
