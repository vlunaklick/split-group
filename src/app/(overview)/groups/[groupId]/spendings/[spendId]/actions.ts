'use server'

import { db } from '@/lib/db'
import { AuthError, requireSession, requireSpendingMember } from '@/lib/server-auth'

export const createComment = async ({ spendingId, comment }: { spendingId: string, comment: string }) => {
  const { userId } = await requireSession()
  await requireSpendingMember(spendingId)

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
  const { userId } = await requireSession()

  const comment = await db.comment.findFirst({
    where: { id: commentId, userId }
  })

  if (!comment) {
    throw new AuthError('No puedes eliminar este comentario')
  }

  await db.comment.delete({
    where: { id: commentId }
  })
}
