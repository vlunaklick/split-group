'use server'

import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'

export async function payAllDebt ({ crediterId, groupId }: { crediterId: string, groupId: string }) {
  const session = await getServerSession(authOptions)
  const userId = session?.user.id

  return db.debt.updateMany({
    where: {
      debterId: userId,
      creditorId: crediterId,
      spending: {
        groupId
      },
      paid: false,
      forgiven: false
    },
    data: {
      paid: true
    }
  })
}

export async function forgiveAllDebt ({ debterId, groupId } : { debterId: string, groupId: string }) {
  const session = await getServerSession(authOptions)
  const userId = session?.user.id

  return db.debt.updateMany({
    where: {
      creditorId: userId,
      debterId,
      spending: {
        groupId
      },
      paid: false,
      forgiven: false
    },
    data: {
      forgiven: true
    }
  })
}
