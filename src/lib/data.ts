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
    value: currency.id,
    name: currency.name,
    symbol: currency.symbol
  }))
}
