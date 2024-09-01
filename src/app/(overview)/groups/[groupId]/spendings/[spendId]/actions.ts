'use server'

import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'

export const createComment = async ({ spendingId, comment }: { spendingId: string, comment: string }) => {
  const session = await getServerSession(authOptions)
  const userId = session?.user.id

  if (!userId) {
    return null
  }

  const newComment = await db.comment.create({
    data: {
      spendingId,
      userId,
      content: comment
    }
  })

  return newComment
}

export const deleteComment = async ({ commentId }: { commentId: string }) => {
  const session = await getServerSession(authOptions)
  const userId = session?.user.id

  if (!userId) {
    return null
  }

  await db.comment.delete({
    where: {
      id: commentId
    }
  }).catch(() => {
    return null
  })
}
