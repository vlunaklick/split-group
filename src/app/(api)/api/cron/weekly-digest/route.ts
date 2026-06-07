import { sendWeeklyDigestToAllUsers } from '@/app/(user)/settings/digest-actions'
import { NextResponse } from 'next/server'

export async function GET (request: Request) {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const result = await sendWeeklyDigestToAllUsers()
  return NextResponse.json(result)
}
