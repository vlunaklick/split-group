import { getSpendingById, getSpendingComments } from '@/data/apis/spendings'

export async function GET (
  request: Request,
  { params }: { params: { spendId: string } }
) {
  const { spendId } = params

  if (!spendId) {
    return Response.json({
      error: 'Spending not found'
    })
  }

  const { searchParams } = new URL(request.url)

  if (searchParams.get('getSpendingById')) {
    const spending = await getSpendingById({ spendingId: spendId })

    return Response.json(spending)
  }

  if (searchParams.get('getSpendingComments')) {
    const comments = await getSpendingComments({ spendingId: spendId })

    return Response.json(comments)
  }

  return Response.json({
    error: 'Invalid query'
  })
}
