import { getCommandPaletteContext, globalSearch } from '@/data/apis/search'
import { requireSession, toAuthResponse } from '@/lib/server-auth'

export async function GET (request: Request) {
  try {
    const { userId } = await requireSession()
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const contextOnly = searchParams.get('context') === 'true'

    if (contextOnly || !query) {
      const context = await getCommandPaletteContext(userId)
      return Response.json(context)
    }

    const results = await globalSearch(userId, query)
    return Response.json(results)
  } catch (error) {
    const response = toAuthResponse(error)
    if (response) return response
    throw error
  }
}
