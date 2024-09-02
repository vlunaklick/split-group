import { db } from '@/lib/db'

export async function getUserByUsername ({ username }: { username: string }) {
  const user = await db.user.findUnique({
    where: { username }
  })

  return user
}
