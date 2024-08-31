'use server'

import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'

export async function leaveGroup (groupId: string) {
  const session = await getServerSession(authOptions)
  const userId = session?.user.id

  await db.group.update({
    where: { id: groupId },
    data: {
      users: {
        disconnect: { id: userId }
      }
    }
  })

  await db.userGroupRole.deleteMany({
    where: {
      userId,
      groupId
    }
  })
}

export async function removeMemberFromGroup (userId: string, groupId: string) {
  const group = await db.group.findFirst({
    where: {
      id: groupId
    }
  })

  if (!group || group.ownerId === userId) {
    return
  }

  await db.group.update({
    where: {
      id: groupId
    },
    data: {
      users: {
        disconnect: {
          id: userId
        }
      }
    }
  })

  const userGroupRole = await db.userGroupRole.findFirst({
    where: {
      userId,
      groupId
    }
  })

  if (!userGroupRole) {
    return
  }

  return await db.userGroupRole.delete({
    where: {
      id: userGroupRole.id
    }
  })
}

export async function giveAdminPermission (userId: string, groupId: string) {
  const userGroupRole = await db.userGroupRole.findFirst({
    where: {
      userId,
      groupId
    }
  })

  if (userGroupRole) {
    return await db.userGroupRole.update({
      where: {
        id: userGroupRole.id
      },
      data: {
        role: 'ADMIN'
      }
    })
  }

  return await db.userGroupRole.create({
    data: {
      userId,
      groupId,
      role: 'ADMIN'
    }
  })
}

export async function removeAdminPermission (userId: string, groupId: string) {
  const userGroupRole = await db.userGroupRole.findFirst({
    where: {
      userId,
      groupId
    }
  })

  if (!userGroupRole) {
    return
  }

  return await db.userGroupRole.update({
    where: {
      id: userGroupRole.id
    },
    data: {
      role: 'USER'
    }
  })
}
