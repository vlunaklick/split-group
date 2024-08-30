import { getUserConfiguration, getAvailableCurrency, getCategories } from '@/data/actions/settings'

export async function GET (request: Request) {
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

  return Response.json({
    message: 'No data found'
  })
}
