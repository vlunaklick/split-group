'use server'

import { ResetPasswordEmail } from '@/components/mails/reset-password'
import { db } from '@/lib/db'
import crypto from 'crypto'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

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

  const code = crypto.randomBytes(20).toString('hex')

  try {
    if (user) {
      await db.forgotPassword.create({
        data: {
          userId: user.id,
          code
        }
      })

      const { error } = await resend.emails.send({
        from: 'SplitGroup <splitgroup@vmoon.me>',
        to: email,
        subject: 'Restablecer contraseña',
        react: ResetPasswordEmail({ username: user.username ?? '', hash: code })
      })

      if (error) {
        console.error('Error sending email:', error)
        return { error: { field: 'email', message: 'Error sending email' } }
      }
    }
  } catch (e) {
    console.error(e)
  }

  return true
}
