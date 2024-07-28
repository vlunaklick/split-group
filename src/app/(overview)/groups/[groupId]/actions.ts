'use server'

import { db } from '@/lib/db'

export async function getLastSpendings (groupId: string) {
  const spending = await db.spending.findMany({
    where: {
      groupId
    },
    include: {
      owner: true,
      category: true
    },
    orderBy: {
      date: 'desc'
    },
    take: 5
  })

  return spending
}
