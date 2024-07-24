'use server'

import { db } from '@/lib/db'

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
