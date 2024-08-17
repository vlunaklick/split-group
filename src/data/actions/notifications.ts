import { db } from '@/lib/db'
import { NotificationType } from '../../../prisma/notification-type-enum'

export async function getNotifications (userId: string) {
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

export async function getGroupNotifications (userId: string) {
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

export async function getAmountNotifications (userId: string) {
  const notifications = await db.notification.findMany({
    where: {
      userId,
      read: false
    }
  })

  return notifications.length
}
