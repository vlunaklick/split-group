import { getUserGroups } from '@/data/apis/groups'
import { requireSession, toAuthResponse } from '@/lib/server-auth'

export async function GET () {
  try {
    await requireSession()
    const userGroups = await getUserGroups()

    return Response.json(userGroups)
  } catch (error) {
    const response = toAuthResponse(error)
    if (response) return response
    throw error
  }
}
