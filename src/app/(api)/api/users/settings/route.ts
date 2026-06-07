import { getUserConfiguration, getAvailableCurrency, getCategories } from '@/data/apis/settings'
import { requireSession, toAuthResponse } from '@/lib/server-auth'

export async function GET (request: Request) {
  try {
    await requireSession()

    const { searchParams } = new URL(request.url)

    const userConfigParam = searchParams.get('userConfig')

    if (userConfigParam) {
      const userConfig = await getUserConfiguration()

      return Response.json(userConfig)
    }

    const availableCurrencyParam = searchParams.get('availableCurrency')

    if (availableCurrencyParam) {
      const availableCurrency = await getAvailableCurrency()

      return Response.json(availableCurrency)
    }

    const categoriesParam = searchParams.get('categories')

    if (categoriesParam) {
      const categories = await getCategories()

      return Response.json(categories)
    }

    return Response.json({ message: 'No data found' })
  } catch (error) {
    const response = toAuthResponse(error)
    if (response) return response
    throw error
  }
}
