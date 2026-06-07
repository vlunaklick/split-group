'use server'

import { createSpending } from '@/app/(overview)/groups/[groupId]/spendings/actions'
import { getGroupParticipants } from '@/data/apis/groups'
import { requireGroupMember } from '@/lib/server-auth'

export async function generateRecurringSpending ({
  groupId,
  name,
  amount,
  description,
  categoryId,
  currencyId
}: {
  groupId: string
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
}
