'use server'

import { db } from '@/lib/db'

export const getCurrentDebts = async ({ groupId, userId, spendId }: { groupId: string, userId: string, spendId: string }) => {
  const debts = await db.debt.findMany({
    where: {
      debterId: userId,
      forgiven: false,
      paid: false,
      spending: {
        id: spendId,
        groupId
      }
    },
    include: {
      creditor: true
    }
  })

  return debts
}

export const getOwedDebts = async ({ groupId, userId, spendId }: { groupId: string, userId: string, spendId: string }) => {
  const debts = await db.debt.findMany({
    where: {
      creditorId: userId,
      forgiven: false,
      paid: false,
      spending: {
        id: spendId,
        groupId
      }
    },
    include: {
      debter: true
    }
  })

  return debts
}
