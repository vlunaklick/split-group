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

export async function updateUsername ({ userId, newUsername }: { userId: string, newUsername: string }) {
  await db.user.update({
    where: {
      id: userId
    },
    data: {
      username: newUsername
    }
  })

  return true
}

export async function updateName ({ userId, newName }: { userId: string, newName: string }) {
  await db.user.update({
    where: {
      id: userId
    },
    data: {
      name: newName
    }
  })

  return true
}
