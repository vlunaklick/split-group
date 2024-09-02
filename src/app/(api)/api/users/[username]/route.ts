import { getUserByUsername } from '@/data/apis/users'

export async function GET (
  request: Request,
  { params }: { params: { username: string } }
) {
  const { username } = params

  if (!username) {
    return Response.json({
      error: 'User not found'
    })
  }

  const user = await getUserByUsername({ username })

  return Response.json(user)
}
