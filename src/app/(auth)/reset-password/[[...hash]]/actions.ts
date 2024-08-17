'use server'

import { db } from '@/lib/db'

export async function updatePassword (password: string, code: string) {
  const requestChangePassword = await db.forgotPassword.findFirst({
    where: { code }
  })

  if (!requestChangePassword) return

  await db.user.update({
    where: { id: requestChangePassword.userId },
    data: { password }
  })
}

export async function isValidChangePassword (hash: string) {
  const changePasswordRequest = await db.forgotPassword.findFirst({
    where: { code: hash }
  })

  if (!changePasswordRequest) {
    return false
  }

  return true
}
