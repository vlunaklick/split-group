'use server'

import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'

export async function getDebts ({ groupId }: { groupId: string }) {
  const session = await getServerSession(authOptions)
  const userId = session?.user.id

  // Obtener las deudas en las que el usuario es el acreedor
  const debts = await db.debt.findMany({
    where: {
      creditorId: userId,
      spending: {
        groupId
      },
      paid: false,
      forgiven: false
    },
    include: {
      debter: true, // Incluye la información del deudor
      spending: true
    },
    orderBy: {
      spending: {
        date: 'desc'
      }
    }
  })

  // Obtener las deudas en las que el usuario es el deudor
  const credits = await db.debt.findMany({
    where: {
      debterId: userId,
      spending: {
        groupId
      },
      paid: false,
      forgiven: false
    },
    include: {
      creditor: true, // Incluye la información del acreedor
      spending: true
    },
    orderBy: {
      spending: {
        date: 'desc'
      }
    }
  })

  const mappedInfo: any[] = []

  // Mapear las deudas
  debts.forEach(debt => {
    const index = mappedInfo.findIndex(info => info.userId === debt.debter.id && info.isDebter)

    if (index !== -1) {
      mappedInfo[index].amount += debt.amount
    } else {
      mappedInfo.push({
        name: debt.debter.name,
        userId: debt.debter.id,
        amount: debt.amount,
        isDebter: true, // El usuario es el deudor
        createdAt: debt.spending.date
      })
    }
  })

  // Mapear los créditos
  credits.forEach(credit => {
    const index = mappedInfo.findIndex(info => info.userId === credit.creditor.id && !info.isDebter)

    if (index !== -1) {
      mappedInfo[index].amount -= credit.amount
    } else {
      mappedInfo.push({
        name: credit.creditor.name,
        userId: credit.creditor.id,
        amount: -credit.amount,
        isDebter: false, // El usuario es el acreedor
        createdAt: credit.spending.date
      })
    }
  })

  // Ordenar el array mapeado por la fecha de creación en orden descendente
  mappedInfo.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

  return mappedInfo
}

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

export async function getSpendingsTable ({ groupId, userId }: { groupId: string, userId: string }) {
  const spendings = await db.spending.findMany({
    where: {
      groupId
    },
    include: {
      payments: true,
      debts: true,
      category: true,
      owner: true
    },
    orderBy: [{
      date: 'desc'
    }, {
      createdAt: 'desc'
    }]
  })

  return spendings.map(spending => ({
    id: spending.id,
    name: spending.name,
    description: spending.description,
    date: spending.date,
    amount: spending.value,
    createdBy: spending.owner.name,
    category: spending.category.name,
    hasDebt: spending.debts.some(debt => debt.debterId === userId && !debt.paid && !debt.forgiven),
    someoneOwesYou: spending.debts.some(debt => debt.creditorId === userId && !debt.paid && !debt.forgiven)
  }))
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

export async function getSpending ({ spendingId }: { spendingId: string }) {
  return db.spending.findUnique({
    where: {
      id: spendingId
    },
    include: {
      payments: true,
      debts: true,
      category: true,
      owner: true,
      currency: true
    }
  })
}

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
