import { getGroupOnboardingProgress, getUserOnboardingProgress } from '@/data/apis/onboarding'
import { requireGroupMember, toAuthResponse } from '@/lib/server-auth'

export async function GET (request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const groupId = searchParams.get('groupId')

    if (groupId) {
      await requireGroupMember(groupId)
      const progress = await getGroupOnboardingProgress(groupId)
      return Response.json(progress)
    }

    const progress = await getUserOnboardingProgress()
    return Response.json(progress)
  } catch (error) {
    const response = toAuthResponse(error)
    if (response) return response
    throw error
  }
}
