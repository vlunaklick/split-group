'use server'

import { db } from '@/lib/db'
import crypto from 'crypto'

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
    }
  })

  if (!group) {
    throw new Error('Group not found')
  }

  const notification = await db.notification.findFirst({
    where: {
      userId: user.id,
      groupId,
      type: 'group_invite'
    }
  })

  if (notification) {
    return {
      error: 'El usuario ya ha sido invitado'
    }
  }

  await db.notification.create({
    data: {
      type: 'group_invite',
      userId: user.id,
      groupId,
      message: `Te han invitado a unirte al grupo *${group.name}*`
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
