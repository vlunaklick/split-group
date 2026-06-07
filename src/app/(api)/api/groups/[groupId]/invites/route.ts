import { getUsersInvitedToGroup, getInvitationLink } from '@/data/apis/groups'
import { requireGroupAdmin, toAuthResponse } from '@/lib/server-auth'

export async function GET (
  request: Request,
  { params }: { params: { groupId: string } }
) {
  try {
    const groupId = params.groupId

    if (!groupId) {
      return Response.json({ error: 'Group not found' })
    }

    const { searchParams } = new URL(request.url)

    if (searchParams.get('getInvitationLink')) {
      await requireGroupAdmin(groupId)
      const invitationLink = await getInvitationLink(groupId)

      return Response.json(invitationLink)
    }

    if (searchParams.get('getUsersInvited')) {
      await requireGroupAdmin(groupId)
      const usersInvited = await getUsersInvitedToGroup(groupId)

      return Response.json(usersInvited)
    }

    return Response.json({ error: 'Invalid query' })
  } catch (error) {
    const response = toAuthResponse(error)
    if (response) return response
    throw error
  }
}
