'use server'

import { db } from '@/lib/db'

export async function updateLimit ({ userId, newLimit }: { userId: string, newLimit: number }) {
  await db.userConfig.update({
    where: {
      userId
    },
    data: {
      limit: newLimit
    }
  })

  return true
}

export async function updateNotificationsWanted ({ userId, invitations, payments, spents }: { userId: string, invitations: boolean, payments: boolean, spents: boolean }) {
  await db.userConfig.update({
    where: {
      userId
    },
    data: {
      inviteNotification: invitations,
      paymentNotification: payments,
      spentNotification: spents
    }
  })

  return true
}
