'use server'

import { db } from '@/lib/db'

export const createGroup = async ({ userId, name, description, icon }: { userId: string, name: string, description: string, icon: string }) => {
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
