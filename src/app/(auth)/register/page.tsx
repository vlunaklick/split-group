import { Metadata } from 'next'
import { RegisterForm } from './register-form'

export const metadata: Metadata = {
  title: 'Crear cuenta',
  description: 'Regístrate en Split Group'
}

export default function Register () {
  return (
    <div className="mx-auto grid w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-display-md">Crear cuenta</h1>
        <p className="text-balance text-muted-foreground">
          Completa tus datos para crear una cuenta
        </p>
      </div>
      <RegisterForm />
    </div>
  )
}
