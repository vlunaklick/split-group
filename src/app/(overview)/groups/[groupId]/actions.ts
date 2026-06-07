'use server'

import { requireGroupAdmin, requireGroupMember, requireGroupOwner } from '@/lib/server-auth'
import { db } from '@/lib/db'
import { NotificationType } from '../../../../../prisma/notification-type-enum'
import { Resend } from 'resend'
import { PayedDebtEmail } from '@/components/mails/payed-debt'
import { ForgiveDebtEmail } from '@/components/mails/forgive-debt'
import { DebtReminderEmail } from '@/components/mails/debt-reminder'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function payAllDebt ({
  crediterId,
  groupId,
  note
}: {
  crediterId: string
  groupId: string
  note?: string
}) {
  const { userId, session } = await requireGroupMember(groupId)
  const payerName = session.user?.name || 'Usuario'

  const debts = await db.debt.findMany({
    where: {
      debterId: userId,
      creditorId: crediterId,
      spending: { groupId },
      paid: false,
      forgiven: false
    },
    include: {
      creditor: { select: { name: true, email: true } },
      debter: { select: { name: true } },
      spending: { select: { name: true, group: { select: { name: true } } } }
    }
  })

  if (debts.length === 0) return

  const trimmedNote = note?.trim()

  await db.debt.updateMany({
    where: {
      id: { in: debts.map((d) => d.id) }
    },
    data: {
      paid: true,
      settledAt: new Date(),
      settlementNote: trimmedNote || null
    }
  })

  const totalAmount = debts.reduce((acc, debt) => acc + debt.amount, 0)
  const spendingName = debts[0].spending.name || 'Gasto'
  const noteSuffix = trimmedNote ? ` Nota: ${trimmedNote}` : ''

  const description = debts.length === 1
    ? `Tu deuda de ${totalAmount.toFixed(2)} en el gasto ${spendingName} ha sido pagada.${noteSuffix}`
    : `${payerName} marcó como pagadas deudas por ${totalAmount.toFixed(2)} en ${debts[0].spending?.group?.name ?? 'el grupo'}.${noteSuffix}`

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
        payer: payerName
      })
    })

    if (error) {
      console.error(error)
    }
  }
}

export async function forgiveAllDebt ({ debterId, groupId } : { debterId: string, groupId: string }) {
  const { userId, session } = await requireGroupMember(groupId)
  const forgiverName = session.user?.name || 'Usuario'

  const debts = await db.debt.findMany({
    where: {
      creditorId: userId,
      debterId,
      spending: { groupId },
      paid: false,
      forgiven: false
    },
    include: {
      debter: { select: { name: true, email: true } },
      creditor: { select: { name: true } },
      spending: { select: { name: true, group: { select: { name: true } } } }
    }
  })

  if (debts.length === 0) return

  await db.debt.updateMany({
    where: {
      id: { in: debts.map((d) => d.id) }
    },
    data: {
      forgiven: true,
      settledAt: new Date()
    }
  })

  const totalAmount = debts.reduce((acc, debt) => acc + debt.amount, 0).toFixed(2)
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
        forgiver: forgiverName
      })
    })

    if (error) {
      console.error(error)
    }
  }
}

export async function sendDebtReminder ({
  groupId,
  debterId
}: {
  groupId: string
  debterId: string
}) {
  const { userId, session } = await requireGroupMember(groupId)
  const creditorName = session.user?.name || 'Un miembro del grupo'

  const debts = await db.debt.findMany({
    where: {
      creditorId: userId,
      debterId,
      spending: { groupId },
      paid: false,
      forgiven: false
    },
    include: {
      debter: { select: { name: true, email: true } },
      spending: { include: { group: { select: { name: true } } } }
    }
  })

  if (debts.length === 0) {
    throw new Error('No hay deudas pendientes con esa persona')
  }

  const totalAmount = debts.reduce((acc, debt) => acc + debt.amount, 0)
  const debter = debts[0].debter
  const groupName = debts[0].spending.group.name

  await db.notification.create({
    data: {
      type: NotificationType.GENERIC,
      userId: debterId,
      groupId,
      title: 'Recordatorio de deuda',
      message: `${creditorName} te recuerda una deuda de ${totalAmount.toFixed(2)} en ${groupName}.`
    }
  })

  if (debter.email && debter.name) {
    const { error } = await resend.emails.send({
      from: 'SplitGroup <splitgroup@vmoon.me>',
      to: debter.email,
      subject: `Recordatorio: debés ${totalAmount.toFixed(2)} en ${groupName}`,
      react: DebtReminderEmail({
        username: debter.name,
        creditorName,
        groupName,
        groupId,
        amount: totalAmount
      })
    })

    if (error) {
      console.error(error)
      throw new Error('No se pudo enviar el email')
    }
  }

  return { totalAmount }
}

export async function deleteGroup (groupId: string) {
  await requireGroupOwner(groupId)
  await db.userGroupRole.deleteMany({
    where: {
      groupId
    }
  })

  await db.spending.deleteMany({
    where: {
      groupId
    }
  })

  await db.payment.deleteMany({
    where: {
      spending: {
        groupId
      }
    }
  })

  await db.groupInvite.deleteMany({
    where: {
      groupId
    }
  })

  await db.comment.deleteMany({
    where: {
      spending: {
        groupId
      }
    }
  })

  await db.debt.deleteMany({
    where: {
      spending: {
        groupId
      }
    }
  })

  await db.group.delete({
    where: {
      id: groupId
    }
  })
}

export async function updateGroup (groupId: string, name: string, description: string) {
  await requireGroupAdmin(groupId)

  return await db.group.update({
    where: {
      id: groupId
    },
    data: {
      name,
      description
    }
  })
}
