import { getMontlySpentGraph } from '@/data/actions/dashboard'

export async function GET (request: Request) {
  const data = await getMontlySpentGraph()

  return Response.json(data)
}
