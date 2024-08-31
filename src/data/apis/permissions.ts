'use server'

import { db } from '@/lib/db'

export async function hasGroupOwnerPermission (userId: string, groupId: string) {
  const group = await db.group.findFirst({
    where: {
      id: groupId
    }
  })

  if (!group) {
    return false
  }

  if (group.ownerId !== userId) {
    return false
  }

  return true
}
