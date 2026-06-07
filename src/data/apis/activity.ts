import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'

export type GroupActivityItem = {
  id: string
  type: 'spending' | 'payment' | 'forgiven'
  at: string
  actorName: string
  title: string
  subtitle?: string
  amount?: number
  receiptUrl?: string | null
  spendingId?: string
}

export async function getGroupActivity ({
  groupId,
  limit = 12
}: {
  groupId: string
  limit?: number
}): Promise<GroupActivityItem[]> {
  const session = await getServerSession(authOptions)
  const userId = session?.user.id

  if (!userId) return []

  const perSource = Math.max(limit, 8)

  const [spendings, settlements] = await Promise.all([
    db.spending.findMany({
      where: { groupId },
      orderBy: { createdAt: 'desc' },
      take: perSource,
      select: {
        id: true,
        name: true,
        value: true,
        createdAt: true,
        owner: { select: { name: true } }
      }
    }),
    db.debt.findMany({
      where: {
        spending: { groupId },
        settledAt: { not: null },
        OR: [{ paid: true }, { forgiven: true }]
      },
      orderBy: { settledAt: 'desc' },
      take: perSource,
      include: {
        debter: { select: { name: true } },
        creditor: { select: { name: true } },
        spending: { select: { id: true, name: true } }
      }
    })
  ])

  const spendingItems: GroupActivityItem[] = spendings.map((spending) => ({
    id: `spending-${spending.id}`,
    type: 'spending',
    at: spending.createdAt.toISOString(),
    actorName: spending.owner.name ?? 'Alguien',
    title: spending.name,
    subtitle: 'Nuevo gasto',
    amount: spending.value,
    spendingId: spending.id
  }))

  const settlementItems: GroupActivityItem[] = settlements.map((debt) => ({
    id: `debt-${debt.id}`,
    type: debt.forgiven ? 'forgiven' : 'payment',
    at: debt.settledAt!.toISOString(),
    actorName: debt.forgiven ? (debt.creditor.name ?? 'Alguien') : (debt.debter.name ?? 'Alguien'),
    title: debt.forgiven
      ? `${debt.creditor.name ?? 'Alguien'} perdonó a ${debt.debter.name ?? 'alguien'}`
      : `${debt.debter.name ?? 'Alguien'} pagó a ${debt.creditor.name ?? 'alguien'}`,
    subtitle: debt.spending.name,
    amount: debt.amount,
    receiptUrl: debt.receiptUrl,
    spendingId: debt.spending.id
  }))

  return [...spendingItems, ...settlementItems]
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, limit)
}
