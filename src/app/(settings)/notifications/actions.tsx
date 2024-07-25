'use server'

import { db } from '@/lib/db'
import { ROLE } from '../../../../prisma/roles-enum'
import { NotificationType } from '../../../../prisma/notification-type-enum'

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

export async function markAsRead (id: string) {
  return await db.notification.update({
    where: {
      id
    },
    data: {
      read: true
    }
  })
}

export async function markAllAsRead (userId: string) {
  return await db.notification.updateMany({
    where: {
      userId
    },
    data: {
      read: true
    }
  })
}

export async function deleteNotification (id: string) {
  return await db.notification.delete({
    where: {
      id
    }
  })
}

export async function joinGroup (userId: string, groupId: string) {
  await db.userGroupRole.create({
    data: {
      userId,
      groupId,
      role: ROLE.USER
    }
  })

  await db.group.update({
    where: {
      id: groupId
    },
    data: {
      users: {
        connect: {
          id: userId
        }
      }
    }
  })

  await db.notification.deleteMany({
    where: {
      userId,
      groupId
    }
  })
}

export async function rejectGroup (notificationId: string) {
  await db.notification.delete({
    where: {
      id: notificationId
    }
  })
}
