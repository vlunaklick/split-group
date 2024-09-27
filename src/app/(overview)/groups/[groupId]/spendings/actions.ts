'use server'

import { db } from '@/lib/db'
import { DistributionModeType, SpendingInfo } from './types'
import { handleDistribution } from '@/utils/distributions'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NotificationType } from '../../../../../../prisma/notification-type-enum'
import { SpendUpdatedEmail } from '@/components/mails/spend-updated'
import { Resend } from 'resend'
import { PayedDebtEmail } from '@/components/mails/payed-debt'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function createSpending ({ groupId, spending, mode }: { groupId: string, spending: SpendingInfo, mode: DistributionModeType }) {
  const session = await getServerSession(authOptions)
  const userId = session?.user.id

  if (!userId) return

  const createdSpending = await db.spending.create({
    data: {
      groupId,
      ownerId: userId,
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
    if (!payment.to || !payment.from) return

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
  const spendingEntity = await db.spending.update({
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
    },
    include: {
      group: true,
      owner: true
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
    if (!payment.to || !payment.from) return

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

  for (const user of spending.payers) {
    await db.notification.create({
      data: {
        type: NotificationType.GENERIC,
        userId: user.userId,
        title: 'Gasto actualizado',
        message: 'El gasto ' + spending.name + ' ha sido actualizado.'
      }
    })
  }

  const { error } = await resend.emails.send({
    from: 'SplitGroup <splitgroup@vmoon.me>',
    to: spendingEntity.owner.email || '',
    subject: 'Gasto actualizado',
    react: SpendUpdatedEmail({
      spendingName: spendingEntity.name,
      groupName: spendingEntity.group.name,
      username: spendingEntity.owner.name || 'Usuario'
    })
  })

  if (error) {
    console.error(error)
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

export async function payDebt ({ debtId }: { debtId: string }) {
  const debt = await db.debt.update({
    where: {
      id: debtId
    },
    data: {
      paid: true
    },
    include: {
      spending: {
        include: {
          group: true
        }
      },
      debter: true,
      creditor: true
    }
  })

  if (!debt) return

  const description = 'Tu deuda de ' + debt.amount.toFixed(2) + ' en el gasto ' + debt.spending.name + ' ha sido pagada.'

  await db.notification.create({
    data: {
      type: NotificationType.GENERIC,
      userId: debt.creditor.id,
      title: 'Deuda pagada',
      message: description
    }
  })

  const { error } = await resend.emails.send({
    from: 'SplitGroup <splitgroup@vmoon.me>',
    to: debt.creditor.email || '',
    subject: 'Deuda pagada',
    react: PayedDebtEmail({
      username: debt.creditor.name || 'Usuario',
      amount: debt.amount,
      groupName: debt.spending.group.name,
      allDebt: false,
      payer: debt.debter.name || 'Usuario'
    })
  })

  if (error) {
    console.error(error)
  }
}

export async function forgiveDebt ({ debtId }: { debtId: string }) {
  const debt = await db.debt.update({
    where: {
      id: debtId
    },
    data: {
      forgiven: true
    },
    include: {
      spending: {
        include: {
          group: true
        }
      },
      debter: true,
      creditor: true
    }
  })

  if (!debt) return

  const description = 'Tu deuda de ' + debt.amount.toFixed(2) + ' en el gasto ' + debt.spending.name + ' ha sido perdonada.'

  await db.notification.create({
    data: {
      type: NotificationType.GENERIC,
      userId: debt.creditor.id,
      title: 'Deuda perdonada',
      message: description
    }
  })

  const { error } = await resend.emails.send({
    from: 'SplitGroup <splitgroup@vmoon.me>',
    to: debt.creditor.email || '',
    subject: 'Deuda perdonada',
    react: PayedDebtEmail({
      username: debt.creditor.name || 'Usuario',
      amount: debt.amount,
      groupName: debt.spending.group.name,
      allDebt: false,
      payer: debt.debter.name || 'Usuario'
    })
  })

  if (error) {
    console.error(error)
  }
}
