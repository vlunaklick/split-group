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

export async function getAccountOverview () {
  const session = await getServerSession(authOptions)
  const userId = session?.user.id

  if (!userId || !session?.user) {
    return null
  }

  const [configuration, groupCount] = await Promise.all([
    db.userConfig.findFirst({ where: { userId } }),
    db.group.count({ where: { users: { some: { id: userId } } } })
  ])

  return {
    user: {
      name: session.user.name,
      email: session.user.email,
      username: session.user.username
    },
    configuration,
    groupCount
  }
}

export async function getAvailableCurrency () {
  return await db.currency.findMany()
}

export async function getCategories () {
  return db.category.findMany()
}
