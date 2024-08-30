'use server'

import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'

export const createGroup = async ({ name, description, icon }: { name: string, description: string, icon: string }) => {
  const session = await getServerSession(authOptions)
  const userId = session?.user.id

  if (!userId) {
    throw new Error('No user found')
  }

  const group = await db.group.create({
    data: {
      name,
      description,
      icon,
      ownerId: userId,
      users: {
        connect: {
          id: userId
        }
      }
    }
  })

  await db.userGroupRole.create({
    data: {
      role: 'ADMIN',
      user: {
        connect: {
          id: userId
        }
      },
      group: {
        connect: {
          id: group.id
        }
      }
    }
  })

  return group
}
