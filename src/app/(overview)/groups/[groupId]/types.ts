import { Prisma } from '@prisma/client'

const spendingWithOwner = Prisma.validator<Prisma.SpendingDefaultArgs>()({
  include: {
    owner: true,
    category: true
  }
})

export type SpendingWithOwner = Prisma.SpendingGetPayload<typeof spendingWithOwner>
