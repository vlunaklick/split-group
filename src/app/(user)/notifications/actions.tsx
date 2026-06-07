'use server'

import { db } from '@/lib/db'
import { requireNotificationOwner, requireSession } from '@/lib/server-auth'
import { ROLE } from '../../../../prisma/roles-enum'
import { NotificationType } from '../../../../prisma/notification-type-enum'

export async function markAsRead (id: string) {
  await requireNotificationOwner(id)

  return await db.notification.update({
    where: { id },
    data: { read: true }
  })
}

export async function markAllAsRead () {
  const { userId } = await requireSession()

  return await db.notification.updateMany({
    where: { userId },
    data: { read: true }
  })
}

export async function deleteNotification (id: string) {
  await requireNotificationOwner(id)

  return await db.notification.delete({
    where: { id }
  })
}

export async function joinGroup (groupId: string) {
  const { userId } = await requireSession()

  const invite = await db.notification.findFirst({
    where: {
      userId,
      groupId,
      type: NotificationType.GROUP_INVITE
    }
  })

  if (!invite) {
    throw new Error('No tienes una invitación pendiente para este grupo')
  }

  await db.userGroupRole.create({
    data: {
      userId,
      groupId,
      role: ROLE.USER
    }
  })

  await db.group.update({
    where: { id: groupId },
    data: {
      users: { connect: { id: userId } }
    }
  })

  await db.notification.deleteMany({
    where: { userId, groupId }
  })
}

export async function rejectGroup (notificationId: string) {
  await requireNotificationOwner(notificationId)

  await db.notification.delete({
    where: { id: notificationId }
  })
}
