'use server'

import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'

export async function updateLimit ({ newLimit }: { newLimit: number }) {
  const session = await getServerSession(authOptions)
  const userId = session?.user.id

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

export async function updateNotificationsWanted ({ invitations, payments, spents }: { invitations: boolean, payments: boolean, spents: boolean }) {
  const session = await getServerSession(authOptions)
  const userId = session?.user.id

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
