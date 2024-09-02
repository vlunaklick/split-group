'use server'

import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { NotificationType } from '../../../../../prisma/notification-type-enum'

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
      spending: {
        select: {
          name: true
        }
      }
    }
  })

  const totalAmount = debts?.reduce((acc, debt) => acc + debt.amount, 0).toFixed(2) || 0

  const spendingName = debts[0].spending.name || 'Gasto'

  const description = 'Tu deuda de ' + totalAmount + ' en el gasto ' + spendingName + ' ha sido pagada.'

  await db.notification.create({
    data: {
      type: NotificationType.GENERIC,
      userId: crediterId,
      title: 'Deuda pagada',
      message: description
    }
  })

  // TODO: Agregar alerta por mail
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
      spending: true
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

  // TODO: Agregar alerta por mail
}
