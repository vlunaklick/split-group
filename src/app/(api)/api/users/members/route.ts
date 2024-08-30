import { getMembersTotal } from '@/data/actions/dashboard'

export async function GET (request: Request) {
  const membersTotal = await getMembersTotal()

  return Response.json(membersTotal)
}
