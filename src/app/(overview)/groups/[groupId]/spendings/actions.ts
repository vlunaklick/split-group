'use server'

import { db } from '@/lib/db'
import { Spending } from './types'

export async function createSpending ({ groupId, spending }: { groupId: string, spending: Spending }) {
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

  // Agregamos quiénes son los que deben y cuánto deben
  // TODO: Ver como manejamos esto
  // for (const user of spending.debters) {
  //   await db.debt.create({
  //     data: {
  //       spendingId: createdSpending.id,
  //       amount: user.amount,
  //       debterId: user.userId,
  //       paid: false,
  //       forgiven: false
  //     }
  //   })
  // }
}

export async function updateSpending ({ spendingId, spending }: { spendingId: string, spending: any }) {
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
      value: spending.value
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

  // Agregamos quiénes son los que deben y cuánto deben
  // ver como calcular esto
  // for (const user of spending.debtors) {
  //   await db.involved.create({
  //     data: {
  //       spendingId,
  //       amount: user.amount,
  //       involvedId: user.userId,
  //       paid: false,
  //       forgiven: false
  //     }
  //   })
  // }
}

export async function deleteSpending ({ spendingId }: { spendingId: string }) {
  await db.spending.delete({
    where: {
      id: spendingId
    }
  })

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
}

export async function getSpending ({ spendingId }: { spendingId: string }) {
  return db.spending.findUnique({
    where: {
      id: spendingId
    },
    include: {
      payments: true,
      debts: true
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

export async function getCategories () {
  return db.category.findMany()
}
