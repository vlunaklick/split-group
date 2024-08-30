import { db } from '@/lib/db'
import { NotificationType } from '../../../prisma/notification-type-enum'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function getNotifications () {
  const session = await getServerSession(authOptions)
  const userId = session?.user.id

  return await db.notification.findMany({
    where: {
      userId,
      type: NotificationType.GENERIC
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}

export async function getGroupNotifications () {
  const session = await getServerSession(authOptions)
  const userId = session?.user.id

  return await db.notification.findMany({
    where: {
      userId,
      type: NotificationType.GROUP_INVITE
    },
    select: {
      id: true,
      message: true,
      type: true,
      createdAt: true,
      read: true,
      acepted: true,
      group: true,
      title: true
    }
  })
}
