import { getMonthlySpent, getTotalDebt, getTotalRevenue, getWeeklySpent } from '@/data/apis/dashboard'
import { getDollarBlueData } from '@/data/apis/money'

export async function GET (request: Request) {
  const { searchParams } = new URL(request.url)

  console.log(searchParams)

  if (searchParams.get('total-revenue')) {
    const data = await getTotalRevenue()

    return Response.json(data)
  }

  if (searchParams.get('total-debt')) {
    const data = await getTotalDebt()

    return Response.json(data)
  }

  if (searchParams.get('monthly-spent')) {
    const data = await getMonthlySpent()

    return Response.json(data)
  }

  if (searchParams.get('weekly-spent')) {
    const data = await getWeeklySpent()

    return Response.json(data)
  }

  if (searchParams.get('dolar')) {
    const data = await getDollarBlueData()

    return Response.json(data ?? 0)
  }

  return Response.json({
    message: 'No data found'
  })
}
