import { getMontlySpentGraph } from '@/data/apis/dashboard'

export async function GET (request: Request) {
  const data = await getMontlySpentGraph()

  return Response.json(data)
}
