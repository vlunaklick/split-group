import { getGroupAdmins, getGroupParticipants, getMembersWithoutAdministrator, isGroupOwner } from '@/data/apis/groups'

export async function GET (
  request: Request,
  { params }: { params: { groupId: string } }
) {
  const groupId = params.groupId

  if (!groupId) {
    return Response.json({
      error: 'Group not found'
    })
  }

  const { searchParams } = new URL(request.url)

  if (searchParams.get('isOwner')) {
    const isOwner = await isGroupOwner(groupId)

    return Response.json({
      isOwner
    })
  }

  if (searchParams.get('getGroupAdmins')) {
    const admins = await getGroupAdmins(groupId)

    return Response.json(admins)
  }

  if (searchParams.get('getMembersWithoutAdmins')) {
    const membersWithoutAdmins = await getMembersWithoutAdministrator(groupId)

    return Response.json(membersWithoutAdmins)
  }

  if (searchParams.get('getGroupParticipants')) {
    const participants = await getGroupParticipants(groupId)

    return Response.json(participants)
  }

  return Response.json({
    error: 'Invalid query'
  })
}
