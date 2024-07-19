'use server'

import { db } from '@/lib/db'

export async function updateLimit ({ userId, newLimit }: { userId: string, newLimit: number }) {
  await db.userConfig.update({
    where: {
      userId
    },
    data: {
      limit: newLimit
    }
  })

  return true
}
