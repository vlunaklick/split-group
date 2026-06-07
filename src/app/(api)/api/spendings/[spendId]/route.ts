import { getSpendingById, getSpendingComments } from '@/data/apis/spendings'
import { requireSpendingMember, toAuthResponse } from '@/lib/server-auth'

export async function GET (
  request: Request,
  { params }: { params: { spendId: string } }
) {
  try {
    const { spendId } = params

    if (!spendId) {
      return Response.json({ error: 'Spending not found' })
    }

    await requireSpendingMember(spendId)

    const { searchParams } = new URL(request.url)

    if (searchParams.get('getSpendingById')) {
      const spending = await getSpendingById({ spendingId: spendId })

      return Response.json(spending)
    }

    if (searchParams.get('getSpendingComments')) {
      const comments = await getSpendingComments({ spendingId: spendId })

      return Response.json(comments)
    }

    return Response.json({ error: 'Invalid query' })
  } catch (error) {
    const response = toAuthResponse(error)
    if (response) return response
    throw error
  }
}
