import { fromDbFrequency, RecurringFrequency, toDbFrequency } from '@/lib/recurring-spendings'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'

export async function getRecurringSpendingsForGroup (groupId: string) {
  const items = await db.recurringSpending.findMany({
    where: { groupId },
    orderBy: { createdAt: 'desc' },
    take: 6
  })

  return items.map((item) => ({
    id: item.id,
    label: item.label,
    name: item.name,
    amount: item.amount,
    categoryId: item.categoryId,
    currencyId: item.currencyId,
    description: item.description,
    frequency: fromDbFrequency(item.frequency),
    lastGeneratedAt: item.lastGeneratedAt?.toISOString() ?? null
  }))
}

export async function createRecurringSpendingRecord ({
  groupId,
  userId,
  label,
  name,
  amount,
  categoryId,
  currencyId,
  description,
  frequency
}: {
  groupId: string
  userId: string
  label: string
  name: string
  amount: number
  categoryId: string
  currencyId: string
  description?: string
  frequency: RecurringFrequency
}) {
  const item = await db.recurringSpending.upsert({
    where: {
      groupId_label: { groupId, label }
    },
    create: {
      groupId,
      createdById: userId,
      label,
      name,
      amount,
      categoryId,
      currencyId,
      description: description ?? null,
      frequency: toDbFrequency(frequency)
    },
    update: {
      name,
      amount,
      categoryId,
      currencyId,
      description: description ?? null,
      frequency: toDbFrequency(frequency)
    }
  })

  return {
    id: item.id,
    label: item.label,
    name: item.name,
    amount: item.amount,
    categoryId: item.categoryId,
    currencyId: item.currencyId,
    description: item.description,
    frequency: fromDbFrequency(item.frequency),
    lastGeneratedAt: item.lastGeneratedAt?.toISOString() ?? null
  }
}

export async function deleteRecurringSpendingRecord ({
  groupId,
  itemId
}: {
  groupId: string
  itemId: string
}) {
  await db.recurringSpending.deleteMany({
    where: { id: itemId, groupId }
  })
}

export async function markRecurringSpendingGenerated ({
  groupId,
  itemId
}: {
  groupId: string
  itemId: string
}) {
  await db.recurringSpending.updateMany({
    where: { id: itemId, groupId },
    data: { lastGeneratedAt: new Date() }
  })
}

export async function importLegacyRecurringSpendings ({
  groupId,
  items
}: {
  groupId: string
  items: Array<{
    label: string
    name: string
    amount: number
    categoryId: string
    currencyId: string
    description?: string
    frequency: RecurringFrequency
  }>
}) {
  const session = await getServerSession(authOptions)
  const userId = session?.user.id
  if (!userId || items.length === 0) return []

  const created = []

  for (const item of items.slice(0, 6)) {
    created.push(await createRecurringSpendingRecord({
      groupId,
      userId,
      ...item
    }))
  }

  return created
}
