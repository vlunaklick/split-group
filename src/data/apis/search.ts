import { db } from '@/lib/db'
import { NotificationType } from '../../../prisma/notification-type-enum'

export type SearchSpendingResult = {
  id: string
  name: string
  groupId: string
  groupName: string
  groupIcon: string | null
}

export type SearchParticipantResult = {
  id: string
  name: string | null
  username: string | null
  groupId: string
  groupName: string
  groupIcon: string | null
}

export type SearchGroupResult = {
  id: string
  name: string
  icon: string | null
}

export type SearchDebtResult = {
  userId: string
  userName: string | null
  groupId: string
  groupName: string
  groupIcon: string | null
  amount: number
  isDebter: boolean
}

export type SearchNotificationResult = {
  id: string
  title: string | null
  message: string
  groupId: string | null
  groupName: string | null
  type: NotificationType
}

export type CommandPaletteContext = {
  pendingInvites: SearchNotificationResult[]
  unreadNotifications: SearchNotificationResult[]
}

export type GlobalSearchResults = {
  spendings: SearchSpendingResult[]
  participants: SearchParticipantResult[]
  groups: SearchGroupResult[]
  debts: SearchDebtResult[]
  notifications: SearchNotificationResult[]
}

const emptyResults: GlobalSearchResults = {
  spendings: [],
  participants: [],
  groups: [],
  debts: [],
  notifications: []
}

async function getUserGroupIds (userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      groups: {
        select: { id: true, name: true, icon: true }
      }
    }
  })

  return user?.groups ?? []
}

export async function getCommandPaletteContext (userId: string): Promise<CommandPaletteContext> {
  const [pendingInvites, unreadNotifications] = await Promise.all([
    db.notification.findMany({
      where: {
        userId,
        type: NotificationType.GROUP_INVITE,
        acepted: null
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        message: true,
        groupId: true,
        type: true,
        group: { select: { name: true } }
      }
    }),
    db.notification.findMany({
      where: {
        userId,
        type: NotificationType.GENERIC,
        read: false
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        message: true,
        groupId: true,
        type: true,
        group: { select: { name: true } }
      }
    })
  ])

  const mapNotification = (notification: typeof pendingInvites[number]): SearchNotificationResult => ({
    id: notification.id,
    title: notification.title,
    message: notification.message,
    groupId: notification.groupId,
    groupName: notification.group?.name ?? null,
    type: notification.type
  })

  return {
    pendingInvites: pendingInvites.map(mapNotification),
    unreadNotifications: unreadNotifications.map(mapNotification)
  }
}

export async function globalSearch (userId: string, query: string): Promise<GlobalSearchResults> {
  const trimmed = query.trim()

  if (trimmed.length < 2) {
    return emptyResults
  }

  const groups = await getUserGroupIds(userId)
  const groupIds = groups.map((group) => group.id)

  if (groupIds.length === 0) {
    return emptyResults
  }

  const [spendings, participantsRaw, debtsRaw, notifications] = await Promise.all([
    db.spending.findMany({
      where: {
        groupId: { in: groupIds },
        stoppedAt: null,
        name: { contains: trimmed, mode: 'insensitive' }
      },
      take: 8,
      orderBy: { date: 'desc' },
      select: {
        id: true,
        name: true,
        groupId: true,
        group: { select: { name: true, icon: true } }
      }
    }),
    db.user.findMany({
      where: {
        id: { not: userId },
        groups: { some: { id: { in: groupIds } } },
        OR: [
          { name: { contains: trimmed, mode: 'insensitive' } },
          { username: { contains: trimmed, mode: 'insensitive' } }
        ]
      },
      take: 8,
      select: {
        id: true,
        name: true,
        username: true,
        groups: {
          where: { id: { in: groupIds } },
          select: { id: true, name: true, icon: true }
        }
      }
    }),
    db.debt.findMany({
      where: {
        paid: false,
        forgiven: false,
        spending: { groupId: { in: groupIds } },
        OR: [
          {
            debterId: userId,
            creditor: {
              OR: [
                { name: { contains: trimmed, mode: 'insensitive' } },
                { username: { contains: trimmed, mode: 'insensitive' } }
              ]
            }
          },
          {
            creditorId: userId,
            debter: {
              OR: [
                { name: { contains: trimmed, mode: 'insensitive' } },
                { username: { contains: trimmed, mode: 'insensitive' } }
              ]
            }
          }
        ]
      },
      take: 8,
      include: {
        debter: { select: { id: true, name: true } },
        creditor: { select: { id: true, name: true } },
        spending: {
          select: {
            groupId: true,
            group: { select: { name: true, icon: true } }
          }
        }
      }
    }),
    db.notification.findMany({
      where: {
        userId,
        OR: [
          { message: { contains: trimmed, mode: 'insensitive' } },
          { title: { contains: trimmed, mode: 'insensitive' } }
        ]
      },
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        message: true,
        groupId: true,
        type: true,
        group: { select: { name: true } }
      }
    })
  ])

  const matchedGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(trimmed.toLowerCase())
  )

  const participants: SearchParticipantResult[] = []

  for (const participant of participantsRaw) {
    for (const group of participant.groups) {
      participants.push({
        id: participant.id,
        name: participant.name,
        username: participant.username,
        groupId: group.id,
        groupName: group.name,
        groupIcon: group.icon
      })
    }
  }

  const debts: SearchDebtResult[] = debtsRaw.map((debt) => {
    const isDebter = debt.debterId === userId
    const counterparty = isDebter ? debt.creditor : debt.debter

    return {
      userId: counterparty.id,
      userName: counterparty.name,
      groupId: debt.spending.groupId,
      groupName: debt.spending.group.name,
      groupIcon: debt.spending.group.icon,
      amount: debt.amount,
      isDebter
    }
  })

  return {
    spendings: spendings.map((spending) => ({
      id: spending.id,
      name: spending.name,
      groupId: spending.groupId,
      groupName: spending.group.name,
      groupIcon: spending.group.icon
    })),
    participants,
    groups: matchedGroups.map((group) => ({
      id: group.id,
      name: group.name,
      icon: group.icon
    })),
    debts,
    notifications: notifications.map((notification) => ({
      id: notification.id,
      title: notification.title,
      message: notification.message,
      groupId: notification.groupId,
      groupName: notification.group?.name ?? null,
      type: notification.type
    }))
  }
}
