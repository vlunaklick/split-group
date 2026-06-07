'use server'

import { GroupInviteEmail } from '@/components/mails/group-invite'
import { db } from '@/lib/db'
import { AuthError, requireGroupAdmin, requireGroupMember } from '@/lib/server-auth'
import crypto from 'crypto'
import { Resend } from 'resend'
import { NotificationType } from '../../../../../../prisma/notification-type-enum'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function leaveGroup (groupId: string) {
  const { userId, group } = await requireGroupMember(groupId)

  if (group.ownerId === userId) {
    throw new AuthError('El dueño no puede abandonar el grupo. Elimínalo o transfiere la propiedad.')
  }

  await db.group.update({
    where: { id: groupId },
    data: {
      users: {
        disconnect: { id: userId }
      }
    }
  })

  await db.userGroupRole.deleteMany({
    where: {
      userId,
      groupId
    }
  })
}

export async function removeMemberFromGroup (userId: string, groupId: string) {
  await requireGroupAdmin(groupId)

  const group = await db.group.findFirst({
    where: { id: groupId },
    select: { ownerId: true }
  })

  if (!group || group.ownerId === userId) {
    return
  }

  await db.group.update({
    where: { id: groupId },
    data: {
      users: {
        disconnect: { id: userId }
      }
    }
  })

  const userGroupRole = await db.userGroupRole.findFirst({
    where: { userId, groupId }
  })

  if (!userGroupRole) {
    return
  }

  return await db.userGroupRole.delete({
    where: { id: userGroupRole.id }
  })
}

export async function giveAdminPermission (userId: string, groupId: string) {
  await requireGroupAdmin(groupId)

  const userGroupRole = await db.userGroupRole.findFirst({
    where: { userId, groupId }
  })

  if (userGroupRole) {
    return await db.userGroupRole.update({
      where: { id: userGroupRole.id },
      data: { role: 'ADMIN' }
    })
  }

  return await db.userGroupRole.create({
    data: { userId, groupId, role: 'ADMIN' }
  })
}

export async function removeAdminPermission (userId: string, groupId: string) {
  const { group } = await requireGroupMember(groupId)
  await requireGroupAdmin(groupId)

  if (group.ownerId === userId) {
    throw new AuthError('No puedes quitar permisos al dueño del grupo')
  }

  const userGroupRole = await db.userGroupRole.findFirst({
    where: { userId, groupId }
  })

  if (!userGroupRole) {
    return
  }

  return await db.userGroupRole.update({
    where: { id: userGroupRole.id },
    data: { role: 'USER' }
  })
}

export async function inviteMemberToGroup (email: string, groupId: string) {
  await requireGroupAdmin(groupId)

  const user = await db.user.findFirst({
    where: { email }
  })

  if (!user) {
    return { error: 'Usuario no encontrado' }
  }

  const group = await db.group.findFirst({
    where: { id: groupId },
    include: { users: true }
  })

  if (!group) {
    throw new Error('Group not found')
  }

  const isUserInGroup = group.users.some(u => u.id === user.id)

  if (isUserInGroup) {
    return { error: 'El usuario ya está en el grupo' }
  }

  const notification = await db.notification.findFirst({
    where: {
      userId: user.id,
      groupId,
      type: NotificationType.GROUP_INVITE
    }
  })

  if (notification) {
    return { error: 'El usuario ya ha sido invitado' }
  }

  await db.notification.create({
    data: {
      type: NotificationType.GROUP_INVITE,
      userId: user.id,
      groupId,
      title: 'Invitación a grupo',
      message: `Te han invitado a unirte al grupo ${group.name}`
    }
  })

  const { error } = await resend.emails.send({
    from: 'SplitGroup <splitgroup@vmoon.me>',
    to: email,
    subject: 'Invitación a grupo',
    react: GroupInviteEmail({
      groupName: group.name,
      username: user.name || 'Usuario'
    })
  })

  if (error) {
    return { error: 'Error al enviar el correo' }
  }
}

export async function generateInvitationLink (groupId: string, maxUses: number) {
  await requireGroupAdmin(groupId)

  const group = await db.group.findFirst({
    where: { id: groupId }
  })

  if (!group) {
    throw new Error('Group not found')
  }

  const code = crypto.randomBytes(20).toString('hex')

  await db.groupInvite.create({
    data: {
      groupId: group.id,
      maxUses,
      code
    }
  })
}

export async function removeInvitationLink (code: string, groupId: string) {
  await requireGroupAdmin(groupId)

  const invite = await db.groupInvite.findFirst({
    where: { code, groupId }
  })

  if (!invite) {
    throw new AuthError('Enlace de invitación no encontrado')
  }

  return db.groupInvite.delete({
    where: { code }
  })
}

export async function removeUserInvitation (userId: string, groupId: string) {
  await requireGroupAdmin(groupId)

  return db.notification.deleteMany({
    where: { userId, groupId }
  })
}
