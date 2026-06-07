import { getGroupDebts, getLatestGroupSpendings, getSpendingsTable } from '@/data/apis/spendings'
import { requireGroupMember, toAuthResponse } from '@/lib/server-auth'
import { getSpendingsSchema } from '@/lib/validations'

export async function GET (
  request: Request,
  { params }: { params: { groupId: string } }
) {
  try {
    const groupId = params.groupId

    if (!groupId) {
      return Response.json({ error: 'Group not found' })
    }

    await requireGroupMember(groupId)

    const { searchParams } = new URL(request.url)

    if (searchParams.get('getGroupDebts')) {
      const groupDebts = await getGroupDebts({ groupId })

      return Response.json(groupDebts)
    }

    if (searchParams.get('getLatestGroupSpendings')) {
      const latestGroupSpendings = await getLatestGroupSpendings(groupId)

      return Response.json(latestGroupSpendings)
    }

    if (searchParams.get('getSpendingsTable')) {
      const search = getSpendingsSchema.parse({
        ...Object.fromEntries(searchParams.entries())
      })

      const spendingsTable = await getSpendingsTable({ groupId, searchParams: search })

      return Response.json(spendingsTable)
    }

    return Response.json({ error: 'Invalid query' })
  } catch (error) {
    const response = toAuthResponse(error)
    if (response) return response
    throw error
  }
}
