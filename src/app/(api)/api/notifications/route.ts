import { getNotifications, getGroupNotifications } from '@/data/apis/notifications'

export async function GET (request: Request) {
  const { searchParams } = new URL(request.url)

  const group = searchParams.get('group')

  if (group) {
    const notifications = await getGroupNotifications()

    return Response.json(notifications)
  }

  const notifications = await getNotifications()

  return Response.json(notifications)
}
