import { Prisma } from '@prisma/client'

const notificationsWithGroups = Prisma.validator<Prisma.NotificationDefaultArgs>()({
  select: {
    id: true,
    message: true,
    type: true,
    createdAt: true,
    read: true,
    acepted: true,
    group: true,
    title: true
  }
})

export type NotificationWithGroups = Prisma.NotificationGetPayload<typeof notificationsWithGroups>
