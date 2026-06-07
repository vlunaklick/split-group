import { getGroupAdmins, getGroupParticipants, getMembersWithoutAdministrator, isGroupOwner } from '@/data/apis/groups'
import { requireGroupAdmin, requireGroupMember, toAuthResponse } from '@/lib/server-auth'

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

    if (searchParams.get('isOwner')) {
      await requireGroupMember(groupId)
      const isOwner = await isGroupOwner(groupId)

      return Response.json({ isOwner })
    }

    if (searchParams.get('getGroupAdmins')) {
      await requireGroupMember(groupId)
      const admins = await getGroupAdmins(groupId)

      return Response.json(admins)
    }

    if (searchParams.get('getMembersWithoutAdmins')) {
      await requireGroupAdmin(groupId)
      const membersWithoutAdmins = await getMembersWithoutAdministrator(groupId)

      return Response.json(membersWithoutAdmins)
    }

    if (searchParams.get('getGroupParticipants')) {
      await requireGroupMember(groupId)
      const participants = await getGroupParticipants(groupId)

      return Response.json(participants)
    }

    return Response.json({ error: 'Invalid query' })
  } catch (error) {
    const response = toAuthResponse(error)
    if (response) return response
    throw error
  }
}
