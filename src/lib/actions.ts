'use server'

import { db } from './db'

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
