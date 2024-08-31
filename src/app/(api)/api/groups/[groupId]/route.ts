import { isGroupOwner } from '@/data/actions/groups'

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

  const isOwnerParam = searchParams.get('isOwner')

  if (isOwnerParam) {
    const isOwner = await isGroupOwner(groupId)

    return Response.json({
      isOwner
    })
  }
}
