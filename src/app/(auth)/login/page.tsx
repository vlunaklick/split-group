import Link from 'next/link'
import { LoginForm } from './login-form'
import { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your account'
}

export default function SignIn () {
  return (
    <div className="mx-auto grid w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Iniciar sesión</h1>
        <p className="text-balance text-muted-foreground">
          Ingrese su nombre de usuario y contraseña para acceder a su cuenta
        </p>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
      <div className="mt-4 text-center text-sm">
        No tienes cuenta?{' '}
        <Link href="/register" className="underline">
          Registrate
        </Link>
      </div>
    </div>
  )
}
