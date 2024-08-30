'use server'

import { db } from '@/lib/db'
import { ROLE } from '../../../../prisma/roles-enum'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

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

export async function markAllAsRead () {
  const session = await getServerSession(authOptions)
  const userId = session?.user.id

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

export async function joinGroup (groupId: string) {
  const session = await getServerSession(authOptions)
  const userId = session?.user.id

  if (!userId) {
    throw new Error('User not found')
  }

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
