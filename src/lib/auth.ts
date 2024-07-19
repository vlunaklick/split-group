import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { comparePassword } from '@/utils/password-utils'
import { db } from './db'

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/login',
    error: '/'
  },
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize (credentials, req) {
        if (!credentials) return null

        const { username, password } = credentials

        const user = await db.user.findUnique({
          where: {
            username,
            deleteAt: null
          }
        }).catch(() => null)

        if (!user) return null

        if (comparePassword(password, user.password)) {
          return user
        }

        return null
      }
    })
  ],
  callbacks: {
    async session ({ token, session }: { token: any; session: any }) {
      if (token && session) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.username = token.username
      }

      return session
    },
    async jwt ({ token, user }: { token: any; user: any }) {
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email
        }
      })

      if (!dbUser) {
        if (user) {
          token.id = user?.id
        }
        return token
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        username: dbUser.username
      }
    }
  }
}
