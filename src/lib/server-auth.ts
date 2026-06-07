import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'

export class AuthError extends Error {
  constructor (message = 'No autorizado') {
    super(message)
    this.name = 'AuthError'
  }
}

export async function requireSession () {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  if (!userId) {
    throw new AuthError()
  }

  return { session, userId }
}

export async function requireGroupMember (groupId: string) {
  const { session, userId } = await requireSession()

  const group = await db.group.findFirst({
    where: {
      id: groupId,
      users: { some: { id: userId } }
    },
    select: { id: true, ownerId: true }
  })

  if (!group) {
    throw new AuthError('No perteneces a este grupo')
  }

  return { userId, group, session }
}

export async function requireGroupAdmin (groupId: string) {
  const { userId } = await requireGroupMember(groupId)

  const adminRole = await db.userGroupRole.findFirst({
    where: { groupId, userId, role: 'ADMIN' }
  })

  if (!adminRole) {
    throw new AuthError('Se requieren permisos de administrador')
  }

  return { userId }
}

export async function requireSpendingOwner (spendingId: string) {
  const { userId } = await requireSession()

  const spending = await db.spending.findFirst({
    where: {
      id: spendingId,
      ownerId: userId
    },
    select: { id: true, groupId: true, ownerId: true }
  })

  if (!spending) {
    throw new AuthError('No puedes modificar este gasto')
  }

  await requireGroupMember(spending.groupId)

  return { userId, spending }
}

export async function requireNotificationOwner (notificationId: string) {
  const { userId } = await requireSession()

  const notification = await db.notification.findFirst({
    where: { id: notificationId, userId },
    select: { id: true, groupId: true, type: true }
  })

  if (!notification) {
    throw new AuthError('Notificación no encontrada')
  }

  return { userId, notification }
}

export const publicUserSelect = {
  id: true,
  name: true,
  username: true,
  createdAt: true
} as const
