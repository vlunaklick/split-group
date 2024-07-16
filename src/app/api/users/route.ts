import { db } from '@/lib/db'
import { Prisma } from '@prisma/client'
import { NextResponse } from 'next/server'

export async function POST (request: Request) {
  const { username, password, name, email } = await request.json()
  try {
    await db.user.create({
      data: {
        username,
        password,
        name,
        email
      }
    })
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        if (!e.meta || !e.meta.target) {
          return NextResponse.json({
            error: 'An error ocurred'
          }, { status: 500 })
        }
        if (!Array.isArray(e.meta.target)) {
          return NextResponse.json({
            error: 'An error ocurred'
          }, { status: 500 })
        }

        let error
        let finalField

        e.meta.target.forEach((field) => {
          if (field === 'username') {
            error = 'El nombre de usuario ya está en uso'
            finalField = 'username'
          }
          if (field === 'email') {
            error = 'El correo electrónico ya está en uso'
            finalField = 'email'
          }
        })

        if (error) {
          return NextResponse.json({
            error,
            field: finalField
          }, { status: 400 })
        }
      }
    }

    return NextResponse.json({
      error: 'An error ocurred'
    }, { status: 500 })
  }

  return NextResponse.json({
    success: true
  })
}
