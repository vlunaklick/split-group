'use server'

import { db } from '@/lib/db'

export async function leaveGroup (groupId: string, userId: string) {
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
