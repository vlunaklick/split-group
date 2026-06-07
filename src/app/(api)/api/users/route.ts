import { getMonthlySpent, getTotalDebt, getTotalRevenue, getWeeklySpent } from '@/data/apis/dashboard'
import { getDollarBlueData } from '@/data/apis/money'
import { requireSession, toAuthResponse } from '@/lib/server-auth'

export async function GET (request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    if (searchParams.get('dolar')) {
      const data = await getDollarBlueData()

      return Response.json(data ?? 0)
    }

    await requireSession()

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

    return Response.json({ message: 'No data found' })
  } catch (error) {
    const response = toAuthResponse(error)
    if (response) return response
    throw error
  }
}
