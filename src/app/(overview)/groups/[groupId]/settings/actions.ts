'use server'

import { db } from '@/lib/db'
import crypto from 'crypto'
import { NotificationType } from '../../../../../../prisma/notification-type-enum'

export async function inviteMemberToGroup (email: string, groupId: string) {
  const user = await db.user.findFirst({
    where: {
      email
    }
  })

  if (!user) {
    return {
      error: 'Usuario no encontrado'
    }
  }

  const group = await db.group.findFirst({
    where: {
      id: groupId
    },
    include: {
      users: true
    }
  })

  if (!group) {
    throw new Error('Group not found')
  }

  const isUserInGroup = group.users.some(u => u.id === user.id)

  if (isUserInGroup) {
    return {
      error: 'El usuario ya está en el grupo'
    }
  }

  const notification = await db.notification.findFirst({
    where: {
      userId: user.id,
      groupId,
      type: NotificationType.GROUP_INVITE
    }
  })

  if (notification) {
    return {
      error: 'El usuario ya ha sido invitado'
    }
  }

  await db.notification.create({
    data: {
      type: NotificationType.GROUP_INVITE,
      userId: user.id,
      groupId,
      title: 'Invitación a grupo',
      message: `Te han invitado a unirte al grupo ${group.name}`
    }
  })
}

export async function generateInvitationLink (groupId: string, maxUses: number) {
  const group = await db.group.findFirst({
    where: {
      id: groupId
    }
  })

  if (!group) {
    throw new Error('Group not found')
  }

  const code = crypto.randomBytes(20).toString('hex')

  await db.groupInvite.create({
    data: {
      groupId: group.id,
      maxUses,
      code
    }
  })
}

export async function getInvitationLink (groupId: string) {
  return db.groupInvite.findMany({
    where: {
      groupId
    }
  })
}

export async function getUsersInvitedToGroup (groupId: string) {
  return db.notification.findMany({
    where: {
      groupId
    },
    select: {
      user: true
    }
  })
}

export async function removeInvitationLink (code: string) {
  return db.groupInvite.delete({
    where: {
      code
    }
  })
}

export async function removeUserInvitation (userId: string, groupId: string) {
  return db.notification.deleteMany({
    where: {
      userId,
      groupId
    }
  })
}

export async function deleteGroup (groupId: string) {
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
