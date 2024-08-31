import { getMembersTotal } from '@/data/apis/dashboard'

export async function GET (request: Request) {
  const membersTotal = await getMembersTotal()

  return Response.json(membersTotal)
}
