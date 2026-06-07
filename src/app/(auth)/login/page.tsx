import Link from 'next/link'
import { LoginForm } from './login-form'
import { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Iniciar sesión',
  description: 'Accede a tu cuenta de Split Group'
}

export default function SignIn () {
  return (
    <div className="mx-auto grid w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-display-md">Iniciar sesión</h1>
        <p className="text-balance text-muted-foreground">
          Ingresa tu nombre de usuario y contraseña para acceder a tu cuenta
        </p>
      </div>
      <Suspense fallback={<div className="text-muted-foreground text-sm">Cargando…</div>}>
        <LoginForm />
      </Suspense>
      <div className="mt-4 text-center text-sm">
        ¿No tienes cuenta?{' '}
        <Link href="/register" className="underline">
          Regístrate
        </Link>
      </div>
    </div>
  )
}
