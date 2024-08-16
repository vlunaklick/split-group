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

export const getPayers = async ({ groupId, spendId }: { groupId: string, spendId: string }) => {
  const spends = await db.payment.findMany({
    where: {
      spending: {
        id: spendId,
        groupId
      }
    },
    include: {
      payer: true
    }
  })

  return spends
}

export const getParticipants = async ({ groupId, spendId }: { groupId: string, spendId: string }) => {
  const debts = await db.debt.findMany({
    where: {
      spending: {
        id: spendId,
        groupId
      }
    },
    include: {
      debter: true
    }
  })

  if (!debts.length) {
    return []
  }

  const uniqueParticipants = new Set(debts.map(debt => debt.debter))

  const payers = await getPayers({ groupId, spendId })

  payers.forEach(payer => {
    uniqueParticipants.delete(payer.payer)
  })

  return Array.from(uniqueParticipants)
}
