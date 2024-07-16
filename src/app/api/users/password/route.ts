import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST (request: Request) {
  const { email } = await request.json()

  let user

  try {
    user = await db.user.findUnique({
      where: {
        email
      }
    })
  } catch (e) {}

  const code = crypto.createHash('sha256').update(email).digest('hex')

  // let forgotPasswordToken

  try {
    if (user) {
      await db.forgotPassword.create({
        data: {
          userId: user.id,
          code
        }
      })
    }
  } catch (e) {}

  return new NextResponse(null, {
    status: 200
  })
}
