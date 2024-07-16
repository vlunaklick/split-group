import { db } from './db'

export async function isValidChangePassword (hash: string) {
  const changePasswordRequest = await db.forgotPassword.findFirst({
    where: { code: hash }
  })

  if (!changePasswordRequest) {
    return false
  }

  return true
}
