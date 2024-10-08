import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { GetSpendingsSchema } from '@/lib/validations'
import { getServerSession } from 'next-auth'

export async function getGroupDebts ({ groupId }: { groupId: string }) {
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
        id: debt.id,
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
  mappedInfo.sort((a, b) => {
    return new Date(b.createdAt ?? new Date()).getTime() - new Date(a.createdAt ?? new Date()).getTime()
  })

  return mappedInfo
}

export async function getLatestGroupSpendings (groupId: string) {
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

export async function getSpendingsTable ({ groupId, searchParams }: { groupId: string, searchParams: GetSpendingsSchema }) {
  const session = await getServerSession(authOptions)
  const userId = session?.user.id

  const limitPerPage = searchParams?.per_page ? searchParams.per_page : 10
  const offset = searchParams?.page ? (searchParams.page - 1) * limitPerPage : 0

  const spendings = await db.spending.findMany({
    where: {
      groupId,
      name: {
        contains: searchParams.name
      }
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
    }],
    skip: offset,
    take: limitPerPage
  })

  const spendingsParsed = spendings.map(spending => ({
    id: spending.id,
    name: spending.name,
    description: spending.description,
    date: spending.date,
    amount: spending.value,
    createdBy: spending.owner.name,
    category: spending.category.name,
    hasDebt: spending.debts.some(debt => debt.debterId === userId && !debt.paid && !debt.forgiven),
    someoneOwesYou: spending.debts.some(debt => debt.creditorId === userId && !debt.paid && !debt.forgiven),
    groupId: spending.groupId
  }))

  const totalCount = await db.spending.count({
    where: {
      groupId,
      name: {
        contains: searchParams.name
      }
    }
  })

  const totalPages = Math.ceil(totalCount / limitPerPage)

  return {
    data: spendingsParsed,
    totalPages,
    totalCount
  }
}

export const getSpendingPayers = async ({ groupId, spendId }: { groupId: string, spendId: string }) => {
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

export const getSpendingParticipants = async ({ groupId, spendId }: { groupId: string, spendId: string }) => {
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

  const payers = await getSpendingPayers({ groupId, spendId })

  payers.forEach(payer => {
    uniqueParticipants.delete(payer.payer)
  })

  return Array.from(uniqueParticipants)
}

export async function getSpendingById ({ spendingId }: { spendingId: string }) {
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

export async function getCustomSpending ({ spendingId, groupId }: { spendingId: string, groupId: string }) {
  const session = await getServerSession(authOptions)
  const userId = session?.user.id

  const spend = await db.spending.findFirst({
    where: {
      id: spendingId,
      groupId
    },
    include: {
      payments: true,
      debts: true,
      category: true,
      owner: true,
      currency: true,
      group: true
    }
  })

  const isOwner = spend?.ownerId === userId

  return {
    spend,
    isOwner
  }
}

export const getSpendingDebts = async ({ groupId, spendId }: { groupId: string, spendId: string }) => {
  const session = await getServerSession(authOptions)
  const userId = session?.user.id

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

export const getSpendingOwedDebts = async ({ groupId, spendId }: { groupId: string, spendId: string }) => {
  const session = await getServerSession(authOptions)
  const userId = session?.user.id

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

export async function getSpendingComments ({ spendingId }: { spendingId: string }) {
  const session = await getServerSession(authOptions)
  const userId = session?.user.id

  const comments = await db.comment.findMany({
    where: {
      spendingId
    },
    include: {
      user: true
    },
    orderBy: {
      createdAt: 'asc'
    }
  })

  return {
    commentsList: comments ?? [],
    userId
  }
}
