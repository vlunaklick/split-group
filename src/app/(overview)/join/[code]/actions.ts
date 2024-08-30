'use server'

import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'

export async function getUserInvitation (code: string) {
  const session = await getServerSession(authOptions)
  const userId = session?.user.id

  if (!userId) {
    return false
  }

  const invitation = await getInvitationByCode(code)

  if (invitation?.group.users.some(user => user.id === userId)) {
    return invitation
  }

  return false
}

export async function getInvitationByCode (code: string) {
  return await db.groupInvite.findFirst({
    where: {
      code
    },
    include: {
      group: {
        include: {
          users: true
        }
      }
    }
  })
}

export async function joinInvitation (code: string, userId: string) {
  const invitation = await getInvitationByCode(code)

  if (!invitation || invitation.uses >= (invitation.maxUses || 1)) {
    return null
  }

  await db.group.update({
    where: {
      id: invitation.groupId
    },
    data: {
      users: {
        connect: {
          id: userId
        }
      }
    }
  })

  await db.userGroupRole.create({
    data: {
      userId,
      groupId: invitation.groupId,
      role: 'USER'
    }
  })

  await db.groupInvite.update({
    where: {
      id: invitation.id
    },
    data: {
      uses: invitation.uses + 1
    }
  })

  await db.notification.updateMany({
    where: {
      userId,
      type: 'GROUP_INVITE'
    },
    data: {
      acepted: true
    }
  })
}
