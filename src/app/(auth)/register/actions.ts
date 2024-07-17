'use server'

import { db } from '@/lib/db'
import { Prisma } from '@prisma/client'

export async function createUser ({ username, password, name, email }: { username: string, password: string, name: string, email: string }) {
  try {
    await db.user.create({
      data: {
        username,
        password,
        name,
        email
      }
    })
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
