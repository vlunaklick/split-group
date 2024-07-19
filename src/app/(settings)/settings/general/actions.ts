'use server'

import { db } from '@/lib/db'

export async function deleteUser ({ userId }: { userId: string }) {
  await db.user.update({
    where: {
      id: userId
    },
    data: {
      email: null,
      username: null
    }
  })

  return true
}
