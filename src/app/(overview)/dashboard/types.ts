import { Prisma } from '@prisma/client'

const spendingWithOwnerAndGroup = Prisma.validator<Prisma.SpendingDefaultArgs>()({
  include: {
    owner: true,
    group: true,
    category: true
  }
})

export type SpendingWithOwnerAndGroup = Prisma.SpendingGetPayload<typeof spendingWithOwnerAndGroup>
