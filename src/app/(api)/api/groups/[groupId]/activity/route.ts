import { getGroupActivity } from '@/data/apis/activity'
import { requireGroupMember, toAuthResponse } from '@/lib/server-auth'

export async function GET (
  request: Request,
  { params }: { params: { groupId: string } }
) {
  try {
    const groupId = params.groupId
    await requireGroupMember(groupId)

    const { searchParams } = new URL(request.url)
    const limit = Number(searchParams.get('limit') ?? 12)

    const activity = await getGroupActivity({
      groupId,
      limit: Number.isFinite(limit) ? limit : 12
    })

    return Response.json(activity)
  } catch (error) {
    const response = toAuthResponse(error)
    if (response) return response
    throw error
  }
}
