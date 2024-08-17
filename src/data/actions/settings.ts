import { db } from '@/lib/db'

export async function getUserConfiguration (userId: string) {
  const configuration = await db.userConfig.findFirst({
    where: {
      userId
    }
  })

  return configuration
}

export async function getAvailableCurrency () {
  return await db.currency.findMany()
}
