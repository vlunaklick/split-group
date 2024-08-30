import { getUserGroups } from '@/data/actions/groups'

export async function GET (request: Request) {
  const userGroups = await getUserGroups()

  return Response.json(userGroups)
}
