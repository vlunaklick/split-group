'use server'

import { db } from '@/lib/db'
import { DistributionMode, DistributionModeType, SpendingInfo } from './types'

export async function createSpending ({ groupId, spending, mode }: { groupId: string, spending: SpendingInfo, mode: DistributionModeType }) {
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

  if (mode === DistributionMode.EQUAL) {
    const payments = handleEqualDistribution({ spending })

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

  if (mode === DistributionMode.EQUAL) {
    const payments = await handleEqualDistribution({ spending })
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

const handleEqualDistribution = ({ spending }: { spending: SpendingInfo }) => {
  // Calcular el monto total que fue pagado
  const totalPaid = spending.payers.reduce((acc, payer) => acc + payer.amount, 0)

  // Calcular el número total de personas involucradas en el gasto
  const totalInvolved = spending.payers.length + spending.debters.length

  // Calcular el monto que cada persona debería pagar
  const amountPerPerson = totalPaid / totalInvolved

  // Crear un array para guardar las deudas de cada persona
  const debts = []

  // Calcular cuánto debe cada deudor
  for (const debter of spending.debters) {
    debts.push({
      person: debter.userId,
      debt: amountPerPerson
    })
  }

  // Calcular cuánto debe cada pagador (si pagaron menos de lo que deberían) o cuánto pagaron de más
  for (const payer of spending.payers) {
    const remainingDebt = amountPerPerson - payer.amount
    if (remainingDebt > 0) {
      debts.push({
        person: payer.userId,
        debt: remainingDebt
      })
    } else {
      debts.push({
        person: payer.userId,
        debt: 0,
        overpaid: -remainingDebt // Guardar el exceso pagado para los reembolsos
      })
    }
  }

  // Crear un array para registrar los pagos
  const payments = []

  // Distribuir las deudas entre los pagadores que pagaron de más
  for (const payer of spending.payers) {
    let overpaidAmount = payer.amount - amountPerPerson
    if (overpaidAmount > 0) {
      for (const debt of debts) {
        if (debt.debt > 0) {
          const paymentAmount = Math.min(debt.debt, overpaidAmount)
          payments.push({
            from: debt.person,
            to: payer.userId,
            amount: paymentAmount
          })
          debt.debt -= paymentAmount
          overpaidAmount -= paymentAmount // Reducir el monto excesivo en consecuencia
        }
      }
    }
  }

  return payments.filter(payment => payment.amount > 0)
}
