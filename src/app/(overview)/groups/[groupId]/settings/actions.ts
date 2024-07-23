'use server'

import { db } from '@/lib/db'
import crypto from 'crypto'

export async function inviteMemberToGroup (username: string, groupId: string) {
  const user = await db.user.findFirst({
    where: {
      username
    }
  })

  if (!user) {
    throw new Error('User not found')
  }

  const group = await db.group.findFirst({
    where: {
      id: groupId
    }
  })

  if (!group) {
    throw new Error('Group not found')
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
