'use server'

import { db } from '@/lib/db'
import { requireSession } from '@/lib/server-auth'

export async function updateLimit ({ newLimit }: { newLimit: number }) {
  const { userId } = await requireSession()

  await db.userConfig.update({
    where: { userId },
    data: { limit: newLimit }
  })

  return true
}

export async function updateNotificationsWanted ({ invitations, payments, spents }: { invitations: boolean, payments: boolean, spents: boolean }) {
  const { userId } = await requireSession()

  await db.userConfig.update({
    where: { userId },
    data: {
      inviteNotification: invitations,
      paymentNotification: payments,
      spentNotification: spents
    }
  })

  return true
}
