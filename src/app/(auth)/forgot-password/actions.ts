'use server'

import { db } from '@/lib/db'
import crypto from 'crypto'

export async function requestChangePassword (email: string) {
  let user
  try {
    user = await db.user.findUnique({
      where: {
        email
      }
    })
  } catch (e) {
    console.error(e)
  }

  const code = crypto.createHash('sha256').digest('hex')

  try {
    if (user) {
      await db.forgotPassword.create({
        data: {
          userId: user.id,
          code
        }
      })
    }
  } catch (e) {
    console.error(e)
  }

  return true
}
