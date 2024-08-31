import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'

export async function getUserConfiguration () {
  const session = await getServerSession(authOptions)
  const userId = session?.user.id

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

export async function getCategories () {
  return db.category.findMany()
}
