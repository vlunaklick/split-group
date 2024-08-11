import { Metadata } from 'next'
import { RegisterForm } from './register-form'

export const metadata: Metadata = {
  title: 'Register',
  description: 'Register your account in Split Group'
}

export default function Register () {
  return (
    <div className="mx-auto grid w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Crear cuenta</h1>
        <p className="text-balance text-muted-foreground">
          Ingrese sus datos para crear una cuenta
        </p>
      </div>
      <RegisterForm />
    </div>
  )
}
