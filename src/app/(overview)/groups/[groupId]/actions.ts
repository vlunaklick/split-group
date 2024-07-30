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

export async function getDebts ({ groupId, userId }: { groupId: string, userId: string }) {
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
