'use server'

import { WelcomeEmail } from '@/components/mails/welcome-email'
import { db } from '@/lib/db'
import { hashPassword } from '@/utils/password-utils'
import { Prisma } from '@prisma/client'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function createUser ({ username, password, name, email }: { username: string, password: string, name: string, email: string }) {
  try {
    const hashedPassword = hashPassword(password)

    await db.user.create({
      data: {
        username,
        password: hashedPassword,
        name,
        email
      }
    })

    const { error } = await resend.emails.send({
      from: 'SplitGroup <splitgroup@vmoon.me>',
      to: email,
      subject: 'Bienvenido a SplitGroup',
      react: WelcomeEmail({ username, firstName: name })
    })

    if (error) {
      console.error('Error sending email:', error)
      return { error: { field: 'email', message: 'Error sending email' } }
    }

    return null
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        if (!e.meta || !e.meta.target) return { error: { field: 'unknown', message: 'An error ocurred' } }
        if (!Array.isArray(e.meta.target)) return { error: { field: 'unknown', message: 'An error ocurred' } }

        let field, message

        e.meta.target.forEach((errorField) => {
          if (errorField === 'username') {
            field = 'username'
            message = 'El nombre de usuario ya está en uso'
          } else if (errorField === 'email') {
            field = 'email'
            message = 'El correo electrónico ya está en uso'
          }
        })

        return { error: { field, message } }
      }
    }
  }

  return { error: { field: 'unknown', message: 'An error ocurred' } }
}
