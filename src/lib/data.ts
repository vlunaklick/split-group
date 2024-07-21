'use server'

import { db } from './db'

export async function isValidChangePassword (hash: string) {
  const changePasswordRequest = await db.forgotPassword.findFirst({
    where: { code: hash }
  })

  if (!changePasswordRequest) {
    return false
  }

  return true
}

export async function getAvailableCurrency () {
  const currencies = await db.currency.findMany()

  return currencies.map(currency => ({
    id: currency.id,
    name: currency.name,
    symbol: currency.symbol
  }))
}

export async function getUserConfiguration (userId: string) {
  const configuration = await db.userConfig.findFirst({
    where: {
      userId
    }
  })

  return configuration
}

export async function getUserGroups (userId: string) {
  const user = await db.user.findUnique({
    where: {
      id: userId
    },
    include: {
      groups: true
    }
  })

  if (!user) {
    return []
  }

  const groups = user.groups.map(group => ({
    id: group.id,
    name: group.name,
    icon: group.icon
  }))

  return groups
}
