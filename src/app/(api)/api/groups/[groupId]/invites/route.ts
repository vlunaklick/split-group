import { getUsersInvitedToGroup, getInvitationLink } from '@/data/apis/groups'

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

  if (searchParams.get('getInvitationLink')) {
    const invitationLink = await getInvitationLink(groupId)

    return Response.json(invitationLink)
  }

  if (searchParams.get('getUsersInvited')) {
    const usersInvited = await getUsersInvitedToGroup(groupId)

    return Response.json(usersInvited)
  }

  return Response.json({
    error: 'Invalid query'
  })
}
