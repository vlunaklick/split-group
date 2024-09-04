'use server'

import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { NotificationType } from '../../../../../prisma/notification-type-enum'
import { Resend } from 'resend'
import { PayedDebtEmail } from '@/components/mails/payed-debt'
import { ForgiveDebtEmail } from '@/components/mails/forgive-debt'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function payAllDebt ({ crediterId, groupId }: { crediterId: string, groupId: string }) {
  const session = await getServerSession(authOptions)
  const userId = session?.user.id

  db.debt.updateMany({
    where: {
      debterId: userId,
      creditorId: crediterId,
      spending: {
        groupId
      },
      paid: false,
      forgiven: false
    },
    data: {
      paid: true
    }
  })

  const debts = await db.debt.findMany({
    where: {
      debterId: userId,
      creditorId: crediterId,
      spending: {
        groupId
      },
      paid: false,
      forgiven: false
    },
    include: {
      creditor: {
        select: {
          name: true,
          email: true
        }
      },
      debter: {
        select: {
          name: true
        }
      },
      spending: {
        select: {
          name: true,
          group: {
            select: {
              name: true
            }
          }
        }
      }
    }
  })

  const totalAmount = debts?.reduce((acc, debt) => acc + debt.amount, 0) || 0

  const spendingName = debts[0].spending.name || 'Gasto'

  const description = 'Tu deuda de ' + totalAmount.toFixed(2) + ' en el gasto ' + spendingName + ' ha sido pagada.'

  await db.notification.create({
    data: {
      type: NotificationType.GENERIC,
      userId: crediterId,
      title: 'Deuda pagada',
      message: description
    }
  })

  if (debts.length === 1 && debts[0].creditor.email && debts[0].creditor.name && totalAmount && debts[0].spending?.group?.name) {
    const { error } = await resend.emails.send({
      from: 'SplitGroup <splitgroup@vmoon.me>',
      to: debts[0].creditor.email,
      subject: 'Deuda pagada',
      react: PayedDebtEmail({
        username: debts[0].creditor.name,
        groupName: debts[0].spending.group.name,
        allDebt: true,
        payer: session?.user.name || 'Usuario'
      })
    })

    if (error) {
      console.error(error)
    }
  }
}

export async function forgiveAllDebt ({ debterId, groupId } : { debterId: string, groupId: string }) {
  const session = await getServerSession(authOptions)
  const userId = session?.user.id

  db.debt.updateMany({
    where: {
      creditorId: userId,
      debterId,
      spending: {
        groupId
      },
      paid: false,
      forgiven: false
    },
    data: {
      forgiven: true
    }
  })

  const debts = await db.debt.findMany({
    where: {
      creditorId: userId,
      debterId,
      spending: {
        groupId
      },
      paid: false,
      forgiven: false
    },
    include: {
      debter: {
        select: {
          name: true,
          email: true
        }
      },
      creditor: {
        select: {
          name: true
        }
      },
      spending: {
        select: {
          name: true,
          group: {
            select: {
              name: true
            }
          }
        }
      }
    }
  })

  const totalAmount = debts.reduce((acc, debt) => acc + debt.amount, 0).toFixed(2) || 0

  const spendingName = debts[0].spending.name || 'Gasto'

  const description = 'Tu deuda de ' + totalAmount + ' en el gasto ' + spendingName + ' ha sido perdonada.'

  await db.notification.create({
    data: {
      type: NotificationType.GENERIC,
      userId: debterId,
      title: 'Deuda perdonada',
      message: description
    }
  })

  if (debts.length === 1 && debts[0].debter.email && debts[0].debter.name && totalAmount && debts[0].spending?.group?.name) {
    const { error } = await resend.emails.send({
      from: 'SplitGroup <splitgroup@vmoon.me>',
      to: debts[0].debter.email,
      subject: 'Deuda perdonada',
      react: ForgiveDebtEmail({
        username: debts[0].debter.name,
        groupName: debts[0].spending.group.name,
        allDebt: true,
        forgiver: session?.user.name || 'Usuario'
      })
    })

    if (error) {
      console.error(error)
    }
  }
}
