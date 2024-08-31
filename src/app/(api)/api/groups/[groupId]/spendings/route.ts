import { getGroupDebts, getLatestGroupSpendings, getSpendingsTable } from '@/data/apis/spendings'

export async function GET (
  request: Request,
  { params }: { params: { groupId: string } }
) {
  const groupId = params.groupId

  if (!groupId) {
    return Response.json({
      error: 'Group not found'
    })
  }

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
    const spendingsTable = await getSpendingsTable({ groupId })

    return Response.json(spendingsTable)
  }

  return Response.json({
    error: 'Invalid query'
  })
}
