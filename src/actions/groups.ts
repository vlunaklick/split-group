'use server'

import { requireSession } from '@/lib/server-auth'
import { db } from '@/lib/db'

export async function createGroup ({ name, description, icon }: { name: string, description: string, icon: string }) {
  const { userId } = await requireSession()

  const group = await db.group.create({
    data: {
      name,
      description,
      icon,
      ownerId: userId,
      users: { connect: { id: userId } }
    }
  })

  await db.userGroupRole.create({
    data: {
      role: 'ADMIN',
      user: { connect: { id: userId } },
      group: { connect: { id: group.id } }
    }
  })

  return group
}
