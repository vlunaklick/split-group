import { getMontlySpentGraph } from '@/data/apis/dashboard'
import { requireSession, toAuthResponse } from '@/lib/server-auth'

export async function GET () {
  try {
    await requireSession()
    const data = await getMontlySpentGraph()

    return Response.json(data)
  } catch (error) {
    const response = toAuthResponse(error)
    if (response) return response
    throw error
  }
}
