import { getSpendingPayers, getSpendingParticipants, getSpendingDebts, getSpendingOwedDebts } from '@/data/apis/spendings'
import { requireGroupMember, toAuthResponse } from '@/lib/server-auth'

export async function GET (
  request: Request,
  { params }: { params: { groupId: string, spendId: string } }
) {
  try {
    const { groupId, spendId } = params

    if (!groupId) {
      return Response.json({ error: 'Group not found' })
    }

    if (!spendId) {
      return Response.json({ error: 'Spending not found' })
    }

    await requireGroupMember(groupId)

    const { searchParams } = new URL(request.url)

    if (searchParams.get('getSpendingPayers')) {
      const spendingPayers = await getSpendingPayers({ groupId, spendId })

      return Response.json(spendingPayers)
    }

    if (searchParams.get('getSpendingParticipants')) {
      const spendingParticipants = await getSpendingParticipants({ groupId, spendId })

      return Response.json(spendingParticipants)
    }

    if (searchParams.get('getSpendingDebts')) {
      const spendingDebts = await getSpendingDebts({ groupId, spendId })

      return Response.json(spendingDebts)
    }

    if (searchParams.get('getSpendingOwedDebts')) {
      const spendingOwedDebts = await getSpendingOwedDebts({ groupId, spendId })

      return Response.json(spendingOwedDebts)
    }

    return Response.json({ error: 'Invalid query' })
  } catch (error) {
    const response = toAuthResponse(error)
    if (response) return response
    throw error
  }
}
