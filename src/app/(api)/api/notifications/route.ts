import { getNotifications, getGroupNotifications } from '@/data/apis/notifications'
import { requireSession, toAuthResponse } from '@/lib/server-auth'

export async function GET (request: Request) {
  try {
    await requireSession()

    const { searchParams } = new URL(request.url)

    const group = searchParams.get('group')

    if (group) {
      const notifications = await getGroupNotifications()

      return Response.json(notifications)
    }

    const notifications = await getNotifications()

    return Response.json(notifications)
  } catch (error) {
    const response = toAuthResponse(error)
    if (response) return response
    throw error
  }
}
