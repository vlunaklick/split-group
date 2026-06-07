import { db } from '@/lib/db'
import { publicUserSelect } from '@/lib/server-auth'

export async function getUserByUsername ({ username }: { username: string }) {
  return db.user.findUnique({
    where: { username, deleteAt: null },
    select: publicUserSelect
  })
}

export async function getUserByUsernameWithEmail ({ username }: { username: string }) {
  return db.user.findUnique({
    where: { username, deleteAt: null },
    select: {
      ...publicUserSelect,
      email: true
    }
  })
}
