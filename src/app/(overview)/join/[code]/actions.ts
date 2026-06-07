'use server'

import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { AuthError, requireSession } from '@/lib/server-auth'
import { getServerSession } from 'next-auth'

export async function getUserInvitation (code: string) {
  const session = await getServerSession(authOptions)
  const userId = session?.user.id

  if (!userId) {
    return null
  }

  const invitation = await getInvitationByCode(code)

  if (!invitation) {
    return null
  }

  const isAlreadyMember = invitation.group.users.some((user) => user.id === userId)

  return { ...invitation, isAlreadyMember }
}

export async function getInvitationByCode (code: string) {
  return await db.groupInvite.findFirst({
    where: { code },
    include: {
      group: {
        include: { users: true }
      }
    }
  })
}

export async function joinInvitation (code: string) {
  const { userId } = await requireSession()
  const invitation = await getInvitationByCode(code)

  if (!invitation || invitation.uses >= (invitation.maxUses || 1)) {
    throw new AuthError('Invitación no válida o agotada')
  }

  const isAlreadyMember = invitation.group.users.some((user) => user.id === userId)

  if (isAlreadyMember) {
    return invitation.groupId
  }

  await db.group.update({
    where: { id: invitation.groupId },
    data: {
      users: { connect: { id: userId } }
    }
  })

  await db.userGroupRole.create({
    data: { userId, groupId: invitation.groupId, role: 'USER' }
  })

  await db.groupInvite.update({
    where: { id: invitation.id },
    data: { uses: invitation.uses + 1 }
  })

  await db.notification.updateMany({
    where: { userId, type: 'GROUP_INVITE' },
    data: { acepted: true }
  })

  return invitation.groupId
}
