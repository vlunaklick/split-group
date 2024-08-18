'use server'

import { db } from '@/lib/db'

export async function payAllDebt ({ userId, crediterId, groupId }: { userId: string, crediterId: string, groupId: string }) {
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

export async function forgiveAllDebt ({ userId, debterId, groupId } : { userId: string, debterId: string, groupId: string }) {
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
