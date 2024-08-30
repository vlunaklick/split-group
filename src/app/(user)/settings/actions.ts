'use server'

import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'

export async function deleteUser () {
  const session = await getServerSession(authOptions)
  const userId = session?.user.id

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

export async function updateUsername ({ newUsername }: { newUsername: string }) {
  const session = await getServerSession(authOptions)
  const userId = session?.user.id

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

export async function updateName ({ newName }: { newName: string }) {
  const session = await getServerSession(authOptions)
  const userId = session?.user.id

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
