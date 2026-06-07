'use server'

import {
  createRecurringSpendingRecord,
  deleteRecurringSpendingRecord,
  getRecurringSpendingsForGroup,
  importLegacyRecurringSpendings,
  markRecurringSpendingGenerated
} from '@/data/apis/recurring-spendings'
import { getGroupParticipants } from '@/data/apis/groups'
import { RecurringFrequency } from '@/lib/recurring-spendings'
import { requireGroupMember } from '@/lib/server-auth'
import { createSpending } from './actions'

export async function listRecurringSpendings ({ groupId }: { groupId: string }) {
  await requireGroupMember(groupId)
  return getRecurringSpendingsForGroup(groupId)
}

export async function saveRecurringSpending ({
  groupId,
  label,
  name,
  amount,
  categoryId,
  currencyId,
  description,
  frequency
}: {
  groupId: string
  label: string
  name: string
  amount: number
  categoryId: string
  currencyId: string
  description?: string
  frequency: RecurringFrequency
}) {
  const { userId } = await requireGroupMember(groupId)

  return createRecurringSpendingRecord({
    groupId,
    userId,
    label,
    name,
    amount,
    categoryId,
    currencyId,
    description,
    frequency
  })
}

export async function removeRecurringSpending ({
  groupId,
  itemId
}: {
  groupId: string
  itemId: string
}) {
  await requireGroupMember(groupId)
  await deleteRecurringSpendingRecord({ groupId, itemId })
}

export async function migrateLegacyRecurringSpendings ({
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
  await requireGroupMember(groupId)
  return importLegacyRecurringSpendings({ groupId, items })
}

export async function generateRecurringSpending ({
  groupId,
  recurringId,
  name,
  amount,
  description,
  categoryId,
  currencyId
}: {
  groupId: string
  recurringId: string
  name: string
  amount: number
  description?: string
  categoryId: string
  currencyId: string
}) {
  const { userId } = await requireGroupMember(groupId)
  const participants = await getGroupParticipants(groupId)
  const eligible = participants.filter((p) => p.id !== userId)

  if (eligible.length === 0) {
    throw new Error('El grupo necesita al menos otro miembro para repartir el gasto')
  }

  await createSpending({
    groupId,
    mode: 'equal',
    spending: {
      name,
      amount,
      description: description ?? '',
      categoryId,
      currencyId,
      date: new Date().toISOString(),
      payers: [{ userId, amount }],
      debters: eligible.map((p) => ({ userId: p.id, amount: 0 }))
    }
  })

  await markRecurringSpendingGenerated({ groupId, itemId: recurringId })
}
